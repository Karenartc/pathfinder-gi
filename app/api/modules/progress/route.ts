import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";

/* ─────────────────────────────────────────────
   GET /api/modules/progress
   🔒 Protegido por token Firebase
   Devuelve solo los módulos en los que el usuario
   tiene progreso registrado (lessonProgress)
────────────────────────────────────────────── */
export async function GET(request: Request) {
  try {
    // 1️⃣ Verificar autenticación
    const token = extractTokenFromHeader(request);
    if (!token)
      return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid)
      return NextResponse.json({ ok: false, message: "Token inválido o expirado", error }, { status: 401 });

    // 2️⃣ Leer progreso del usuario
    const progressSnap = await adminDb
      .collection("users")
      .doc(uid)
      .collection("lessonProgress")
      .get();

    if (progressSnap.empty) {
      return NextResponse.json({ ok: true, count: 0, courses: [] });
    }

    // 👉 Tipado básico para evitar errores TS
    const progressData = progressSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as { moduleId: string; progress?: number }),
    }));

    const moduleIds = progressData.map((p) => p.moduleId);

    // 3️⃣ Obtener los módulos correspondientes a ese progreso
    const modules: any[] = [];
    for (const moduleId of moduleIds) {
      const modSnap = await adminDb.collection("modules").doc(moduleId).get();
      if (modSnap.exists) {
        modules.push({ id: modSnap.id, ...modSnap.data() });
      }
    }

    // 4️⃣ Combinar módulo + progreso
    const courses = modules.map((mod) => {
      const userProgress = progressData.find((p) => p.moduleId === mod.id);
      return {
        id: mod.id,
        title: (mod as any).name || "Sin título",
        image: (mod as any).imageUrl || "/images/PathFox-mapa.png",
        progress: userProgress?.progress || 0,
        lessons: [],
      };
    });

    return NextResponse.json({ ok: true, count: courses.length, courses });
  } catch (err: any) {
    console.error("❌ Error en /api/modules/progress:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener progreso de módulos", error: err.message },
      { status: 500 }
    );
  }
}
