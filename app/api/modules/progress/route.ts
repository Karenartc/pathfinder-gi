import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, query, where, orderBy, doc, getDoc } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    // 1. Obtener el userId del header
    const userId = request.headers.get("X-User-Id");

    if (!userId) {
      return NextResponse.json(
        { message: "ID de usuario no proporcionado." },
        { status: 400 }
      );
    }

    // 2. Obtener todos los módulos activos
    const modulesRef = collection(db, "modules");
    const modulesQuery = query(
      modulesRef,
      where("isActive", "==", true),
      orderBy("order", "asc")
    );

    const modulesSnapshot = await getDocs(modulesQuery);

    // 3. Para cada módulo, obtener progreso y lecciones
    const coursesWithProgress = await Promise.all(
      modulesSnapshot.docs.map(async (moduleDoc) => {
        const moduleData = moduleDoc.data();

        // 3.1. Buscar progreso del usuario para este módulo
        const progressRef = doc(
          db,
          "users",
          userId,
          "moduleProgress",
          moduleDoc.id
        );

        let progress = 0;
        try {
          const progressDoc = await getDoc(progressRef);
          if (progressDoc.exists()) {
            progress = progressDoc.data().progress || 0;
          }
        } catch (error) {
          progress = 0;
        }

        // 3.2. Obtener las lecciones de este módulo
        const lessonsRef = collection(db, "modules", moduleDoc.id, "lessons");
        const lessonsQuery = query(lessonsRef, orderBy("orderIndex", "asc"));
        
        let lessons: any[] = [];
        try {
          const lessonsSnapshot = await getDocs(lessonsQuery);
          lessons = lessonsSnapshot.docs.map((lessonDoc) => {
            const lessonData = lessonDoc.data();
            return {
              id: lessonDoc.id,
              title: lessonData.title || "Sin título",
              description: lessonData.content || "",
              completed: false, // TODO: Obtener de progreso del usuario
            };
          });
        } catch (error) {
          console.error(`Error al obtener lecciones del módulo ${moduleDoc.id}:`, error);
          lessons = [];
        }

        return {
          id: moduleDoc.id,
          title: moduleData.name || moduleData.title || "Sin título",
          progress: progress, // 0-100
          image: moduleData.imageUrl || "/images/PathFox-estudiante.png",
          lessons: lessons, // ← Ahora incluye las lecciones
        };
      })
    );

    // 4. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Progreso de módulos obtenido exitosamente",
        courses: coursesWithProgress,
        count: coursesWithProgress.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener progreso de módulos:", error);

    return NextResponse.json(
      {
        message: "Error al obtener el progreso de módulos.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}