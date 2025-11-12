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
  const { id } = await context.params;
  try {
    const token = extractTokenFromHeader(request);
    if (!token)
      return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid)
      return NextResponse.json(
        { ok: false, message: "Token inválido o expirado", error },
        { status: 401 }
      );

    const { lessonId } = await request.json();
    if (!lessonId)
      return NextResponse.json(
        { ok: false, message: "Falta el ID de la lección" },
        { status: 400 }
      );

    const moduleId = id;

    // Leer todas las lecciones del módulo
    const lessonsSnap = await adminDb
      .collection("modules")
      .doc(moduleId)
      .collection("lessons")
      .get();
    const totalLessons = lessonsSnap.size || 1;

    // Progreso del usuario
    const progressRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("lessonProgress")
      .doc(moduleId);

    const progressDoc = await progressRef.get();
    let completedLessons: string[] = [];

    if (progressDoc.exists) {
      const data = progressDoc.data();
      completedLessons = Array.isArray(data?.completedLessons)
        ? data.completedLessons
        : [];
    }

    if (!completedLessons.includes(lessonId)) {
      completedLessons.push(lessonId);
    }

    const progressPercent = Math.min(
      Math.round((completedLessons.length / totalLessons) * 100),
      100
    );

    await progressRef.set(
      {
        moduleId,
        completedLessons,
        progress: progressPercent,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

    // umar puntos al usuario
    const userRef = adminDb.collection("users").doc(uid);
    await adminDb.runTransaction(async (t) => {
      const userDoc = await t.get(userRef);
      if (!userDoc.exists) return;
      const userData = userDoc.data()!;
      const currentPoints = userData.totalPoints || 0;
      const newPoints = currentPoints + 10;
      t.update(userRef, { totalPoints: newPoints });
    });

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
