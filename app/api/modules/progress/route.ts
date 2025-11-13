// Endpoint para obtener el progreso de módulos del usuario usando Firebase Admin SDK

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

export async function GET(request: Request) {
  try {
    // 1. Verificar el token del usuario
    const authHeader = request.headers.get("Authorization");
    const token = extractTokenFromHeader(authHeader);
    
    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No se proporcionó token de autenticación." },
        { status: 401 }
      );
    }

    // 2. Verificar el token y obtener el UID del usuario
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error: any) {
      console.error("Error al verificar token:", error);
      return NextResponse.json(
        { 
          ok: false,
          message: "Token inválido o expirado.",
          error: error.code 
        },
        { status: 403 }
      );
    }

    const userId = decodedToken.uid;
    console.log(`✅ Usuario autenticado: ${userId}`);

    // 3. Obtener todos los módulos activos (usando Admin SDK)
    const modulesRef = adminDb.collection("modules");
    const modulesQuery = modulesRef
      .where("isActive", "==", true)
      .orderBy("order", "asc");

    const modulesSnapshot = await modulesQuery.get();
    console.log(`📚 Módulos encontrados: ${modulesSnapshot.size}`);

    // 4. Para cada módulo, obtener progreso y lecciones
    const coursesWithProgress = await Promise.all(
      modulesSnapshot.docs.map(async (moduleDoc) => {
        const moduleData = moduleDoc.data();

        // 4.1. Buscar el progreso del usuario en este módulo
        const progressRef = adminDb
          .collection("users")
          .doc(userId)
          .collection("moduleProgress")
          .doc(moduleDoc.id);

        let progress = 0;
        try {
          const progressDoc = await progressRef.get();
          if (progressDoc.exists) {
            const progressData = progressDoc.data();
            progress = progressData?.progress || 0;
          }
        } catch (error) {
          console.warn(`⚠️ No se pudo obtener progreso del módulo ${moduleDoc.id}`);
          progress = 0;
        }

        // 4.2. Obtener las lecciones de este módulo
        const lessonsRef = adminDb
          .collection("modules")
          .doc(moduleDoc.id)
          .collection("lessons");
        
        const lessonsQuery = lessonsRef.orderBy("orderIndex", "asc");

        let lessons: any[] = [];
        try {
          const lessonsSnapshot = await lessonsQuery.get();
          lessons = lessonsSnapshot.docs.map((lessonDoc) => {
            const lessonData = lessonDoc.data();
            return {
              id: lessonDoc.id,
              title: lessonData.title || "Sin título",
              description: lessonData.content || "",
              completed: false, // TODO: Implementar lógica de completed
            };
          });
        } catch (error) {
          console.error(`❌ Error al obtener lecciones del módulo ${moduleDoc.id}:`, error);
          lessons = [];
        }

        // 4.3. Retornar el curso con su progreso y lecciones
        return {
          id: moduleDoc.id,
          title: moduleData.name || moduleData.title || "Sin título",
          progress: progress,
          image: moduleData.imageUrl || "/images/PathFox-estudiante.png",
          lessons: lessons,
        };
      })
    );

    // 5. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Progreso de módulos obtenido exitosamente",
        courses: coursesWithProgress,
        count: coursesWithProgress.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error en API /api/modules/progress:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener el progreso de módulos.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}