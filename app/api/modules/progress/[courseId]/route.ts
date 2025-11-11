// Endpoint para obtener el detalle de un curso/módulo específico con sus lecciones

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

type RouteParams = {
  params: Promise<{ courseId: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {
    // 1. Verificar token
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { ok: false, message: "Token no proporcionado." },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { ok: false, message: "Token inválido." },
        { status: 403 }
      );
    }

    const userId = decodedToken.uid;
    const { courseId } = await params;

    // 2. Obtener el módulo/curso
    const moduleRef = adminDb.collection("modules").doc(courseId);
    const moduleDoc = await moduleRef.get();

    if (!moduleDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Curso no encontrado." },
        { status: 404 }
      );
    }

    const moduleData = moduleDoc.data();

    // 3. Obtener progreso del usuario
    const progressRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("moduleProgress")
      .doc(courseId);

    let progress = 0;
    const progressDoc = await progressRef.get();
    if (progressDoc.exists) {
      progress = progressDoc.data()?.progress || 0;
    }

    // 4. Obtener lecciones
    const lessonsRef = adminDb
      .collection("modules")
      .doc(courseId)
      .collection("lessons");
    
    const lessonsQuery = lessonsRef.orderBy("orderIndex", "asc");
    const lessonsSnapshot = await lessonsQuery.get();

    const lessons = lessonsSnapshot.docs.map((lessonDoc) => {
      const lessonData = lessonDoc.data();
      return {
        id: lessonDoc.id,
        title: lessonData.title || "Sin título",
        subtitle: lessonData.subtitle || "",
        description: lessonData.content || "",
        image: lessonData.imageUrl || "/images/default-lesson.png",
        completed: false, // TODO: Implementar
      };
    });

    // 5. Respuesta
    return NextResponse.json({
      ok: true,
      course: {
        id: moduleDoc.id,
        title: moduleData?.name || moduleData?.title || "Sin título",
        description: moduleData?.description || "",
        progress: progress,
        image: moduleData?.imageUrl || "/images/PathFox-estudiante.png",
        lessons: lessons,
      },
    });

  } catch (error: any) {
    console.error("❌ Error en /api/modules/[courseId]:", error);
    return NextResponse.json(
      { ok: false, message: "Error al obtener el curso.", error: error.message },
      { status: 500 }
    );
  }
}