// app/api/modules/[id]/complete/route.ts
import { NextResponse } from "next/server";
import {
  adminDb,
  extractTokenFromHeader,
  verifyAuthToken,
} from "@/libs/firebaseAdminConfig";

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: moduleId } = await context.params;
    const token = extractTokenFromHeader(request);
    
    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No token" },
        { status: 401 }
      );
    }

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid) {
      return NextResponse.json(
        { ok: false, message: "Token inválido o expirado", error },
        { status: 401 }
      );
    }

    const { lessonId } = await request.json();
    if (!lessonId) {
      return NextResponse.json(
        { ok: false, message: "Falta el ID de la lección" },
        { status: 400 }
      );
    }

    // Leer todas las lecciones del módulo
    const lessonsSnap = await adminDb
      .collection("modules")
      .doc(moduleId)
      .collection("lessons")
      .get();
    const totalLessons = lessonsSnap.size || 1;

    // Documento de progreso POR moduleId
    const progressRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("lessonProgress")
      .doc(moduleId);

    const progressDoc = await progressRef.get();
    let completedLessons: string[] = [];
    let prevProgress = 0;

    if (progressDoc.exists) {
      const data = progressDoc.data();
      completedLessons = Array.isArray(data?.completedLessons)
        ? data.completedLessons
        : [];
      prevProgress = typeof data?.progress === "number" ? data.progress : 0;
    }

    const wasAlreadyCompleted = completedLessons.includes(lessonId);

    // Agregar la lección completada si no existe
    if (!wasAlreadyCompleted) {
      completedLessons.push(lessonId);
    }

    const progressPercent = Math.min(
      Math.round((completedLessons.length / totalLessons) * 100),
      100
    );

    // Guardar progreso unificado
    await progressRef.set(
      {
        moduleId,
        completedLessons,
        progress: progressPercent,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // ---------------------------
    //   SUMAR PUNTOS POR LECCIÓN
    // ---------------------------
    if (!wasAlreadyCompleted) {
      const userRef = adminDb.collection("users").doc(uid);

      await adminDb.runTransaction(async (t) => {
        const userDoc = await t.get(userRef);
        if (!userDoc.exists) return;

        const userData = userDoc.data()!;
        const currentPoints = userData.totalPoints || 0;

        t.update(userRef, {
          totalPoints: currentPoints + 10, // +10 por lección completada
        });
      });

      // ---------------------------
      //   NOTIFICACIÓN LECCIÓN
      // ---------------------------
      const notifRef = adminDb
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef.set({
        id: notifRef.id,
        type: "lesson",
        title: "Lección completada",
        message: `Has completado una nueva lección del módulo.`,
        moduleId,
        lessonId,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    // ------------------------------------------------
    //   LOGRO + NOTIFICACIÓN SI COMPLETÓ EL MÓDULO 100%
    // ------------------------------------------------
    if (progressPercent === 100 && prevProgress < 100) {
      const moduleDoc = await adminDb.collection("modules").doc(moduleId).get();
      const moduleData = moduleDoc.data() || {};
      const moduleTitle =
        (moduleData as any).name ||
        (moduleData as any).title ||
        "Módulo";

      // Achievement
      const achievementRef = adminDb
        .collection("users")
        .doc(uid)
        .collection("userAchievements")
        .doc();

      await achievementRef.set({
        id: achievementRef.id,
        moduleId,
        name: "Módulo completado",
        description: `Has completado el módulo "${moduleTitle}".`,
        iconUrl: "/images/achievements/course-complete.png",
        pointsAwarded: 30,
        awardedAt: new Date().toISOString(),
      });

      // Sumar puntos del achievement (+30)
      const userRef = adminDb.collection("users").doc(uid);

      await adminDb.runTransaction(async (t) => {
        const u = await t.get(userRef);
        if (!u.exists) return;

        const currentPoints = u.data()?.totalPoints || 0;
        t.update(userRef, {
          totalPoints: currentPoints + 30,
        });
      });

      // Notificación del módulo completado
      const notifRef2 = adminDb
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef2.set({
        id: notifRef2.id,
        type: "achievement",
        title: "¡Módulo completado!",
        message: `Has finalizado el módulo "${moduleTitle}".`,
        moduleId,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    return NextResponse.json({
      ok: true,
      message: "Lección completada y progreso actualizado",
      progress: progressPercent,
    });
  } catch (err: any) {
    console.error("Error en /api/modules/[id]/complete:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al registrar progreso",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
