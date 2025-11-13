// app/api/modules/[id]/complete/route.ts
import { NextResponse } from "next/server";
import {
  adminDb,
  extractTokenFromHeader,
  verifyAuthToken,
} from "@/libs/firebaseAdminConfig";
import admin from "firebase-admin";

/* ─────────────────────────────────────────────
   POST /api/modules/[id]/complete
   🔒 Protegido por token Firebase
   Marca lección como completada, actualiza progreso
   y, si el módulo llega al 100%, crea logro + notificación
─────────────────────────────────────────────── */
export async function POST(request: Request, context: any) {
  try {
    const moduleId = context?.params?.id as string;

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

    // 1️⃣ Leer todas las lecciones del módulo
    const lessonsSnap = await adminDb
      .collection("modules")
      .doc(moduleId)
      .collection("lessons")
      .get();
    const totalLessons = lessonsSnap.size || 1;

    // 2️⃣ Buscar documento de progreso POR moduleId
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
      prevProgress =
        typeof data?.progress === "number" ? data.progress : 0;
    }

    // 3️⃣ Agregar la lección completada si no existe
    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const progressPercent = Math.min(
      Math.round((completedLessons.length / totalLessons) * 100),
      100
    );

    // 4️⃣ Guardar progreso unificado
    await progressRef.set(
      {
        moduleId,
        completedLessons,
        progress: progressPercent,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // 5️⃣ Sumar puntos al usuario (10 pts por lección, igual que antes)
    const userRef = adminDb.collection("users").doc(uid);
    await adminDb.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) return;
      const userData = userDoc.data()!;
      const currentPoints = userData.totalPoints || 0;
      const newPoints = currentPoints + 10;
      t.update(userRef, { totalPoints: newPoints });
    });

    // 6️⃣ Si el módulo acaba de llegar al 100% → crear logro + notificación
    if (progressPercent === 100 && prevProgress < 100) {
      // Leer info del módulo para el texto
      const moduleDoc = await adminDb
        .collection("modules")
        .doc(moduleId)
        .get();
      const moduleData = moduleDoc.data() || {};
      const moduleTitle =
        (moduleData as any).name ||
        (moduleData as any).title ||
        "Módulo";

      // 🔹 Achievement en subcolección userAchievements
      const achievementRef = adminDb
        .collection("users")
        .doc(uid)
        .collection("userAchievements")
        .doc(); // id auto

      await achievementRef.set({
        id: achievementRef.id,
        moduleId,
        name: "Módulo completado",
        description: `Has completado el módulo "${moduleTitle}".`,
        iconUrl: "/images/achievements/course-complete.png",
        pointsAwarded: 0, // solo metadata; no modifica totalPoints
        awardedAt: new Date().toISOString(),
      });

      // 🔹 Notificación asociada a ese logro
      const notifRef = adminDb
        .collection("users")
        .doc(uid)
        .collection("notifications")
        .doc();

      await notifRef.set({
        id: notifRef.id,
        type: "achievement",
        title: "¡Módulo completado!",
        message: `Ganaste el logro "Módulo completado" por terminar "${moduleTitle}".`,
        read: false,
        createdAt: new Date().toISOString(),
      });
    }

    console.log(
      `✅ Usuario ${uid} completó ${lessonId} (${progressPercent}% en ${moduleId})`
    );

    return NextResponse.json({
      ok: true,
      message: "Lección completada y progreso actualizado",
      progress: progressPercent,
    });
  } catch (err: any) {
    console.error("❌ Error en /api/modules/[id]/complete:", err);
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
