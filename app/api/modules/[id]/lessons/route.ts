import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    // Verificar token del usuario
    const token = extractTokenFromHeader(request);
    if (!token)
      return NextResponse.json(
        { ok: false, message: "No token" },
        { status: 401 }
      );

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid)
      return NextResponse.json(
        { ok: false, message: "Token inválido o expirado", error },
        { status: 401 }
      );

    // Leer módulo y sus lecciones
    const moduleRef = adminDb.collection("modules").doc(id);
    const [moduleDoc, lessonsSnap] = await Promise.all([
      moduleRef.get(),
      moduleRef.collection("lessons").get(), // sin orderBy → trae todas
    ]);

    if (!moduleDoc.exists)
      return NextResponse.json(
        { ok: false, message: "Módulo no encontrado" },
        { status: 404 }
      );

    const moduleData = moduleDoc.data();

    // Leer progreso del usuario (para marcar completadas)
    const progressRef = adminDb
      .collection("users")
      .doc(uid)
      .collection("lessonProgress")
      .doc(id);

    const progressDoc = await progressRef.get();
    const completedLessons: string[] = progressDoc.exists
      ? progressDoc.data()?.completedLessons || []
      : [];

    // Mapear y marcar las lecciones completadas
    const lessons = lessonsSnap.docs
      .map((doc) => {
        const data = doc.data() as any;
        const isCompleted = completedLessons.includes(doc.id);

        return {
          id: doc.id,
          title: data.title || "Sin título",
          subtitle: data.subtitle || "",
          description: data.subtitle || data.content?.[0] || "",
          image: data.image || "/images/PathFox-estudiante.png",
          content: data.content || [],
          questions: data.questions || [],
          estimatedTimeMinutes: data.estimatedTimeMinutes || null,
          order: data.order ?? 0,
          completed: isCompleted, 
        };
      })
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

    // Devolver estructura final
    return NextResponse.json({
      ok: true,
      module: {
        id: moduleDoc.id,
        title: moduleData?.name || "Sin título",
        description: moduleData?.description || "",
        image: moduleData?.imageUrl || "/images/PathFox-mapa.png",
        lessons,
      },
    });
  } catch (err: any) {
    console.error("Error en /api/modules/[id]/lessons:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener lecciones del módulo",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
