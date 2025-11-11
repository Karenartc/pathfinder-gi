// Endpoint para obtener el detalle de una lección específica

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

type RouteParams = {
  params: Promise<{ courseId: string; lessonId: string }>;
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

    const { courseId, lessonId } = await params;

    // 2. Obtener la lección
    const lessonRef = adminDb
      .collection("modules")
      .doc(courseId)
      .collection("lessons")
      .doc(lessonId);

    const lessonDoc = await lessonRef.get();

    if (!lessonDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Lección no encontrada." },
        { status: 404 }
      );
    }

    const lessonData = lessonDoc.data();

    // 3. Formatear la respuesta
    const lesson = {
      id: lessonDoc.id,
      title: lessonData?.title || "Sin título",
      subtitle: lessonData?.subtitle || "",
      content: lessonData?.content || [""], // Array de párrafos
      image: lessonData?.imageUrl || "/images/default-lesson.png",
      questions: lessonData?.questions || [], // Para el quiz
    };

    // 4. Respuesta
    return NextResponse.json({
      ok: true,
      lesson: lesson,
    });

  } catch (error: any) {
    console.error("❌ Error en /api/modules/[courseId]/lessons/[lessonId]:", error);
    return NextResponse.json(
      { ok: false, message: "Error al obtener la lección.", error: error.message },
      { status: 500 }
    );
  }
}