import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

/**
 * GET /api/ranking/career
 * 
 * Retorna el ranking de estudiantes de una carrera específica.
 * Los estudiantes están ordenados por totalPoints dentro de su carrera.
 * 
 * Query params requeridos:
 * - career: nombre de la carrera (ej: "Ingeniería Informática")
 * 
 * Query params opcionales:
 * - limit: número máximo de resultados (default: 100)
 * 
 * Respuesta:
 * {
 *   message: string,
 *   career: string,
 *   ranking: User[],
 *   count: number
 * }
 */

// Lista de carreras válidas en el sistema
const VALID_CAREERS = [
  "Diseño Gráfico",
  "Ingeniería Informática",
  "Ingeniería Automatización",
  "Administración de Empresas",
];

export async function GET(request: Request) {
  try {
    // 1. Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const career = searchParams.get("career");
    const limitParam = searchParams.get("limit");
    const maxResults = limitParam ? parseInt(limitParam) : 100;

    // 2. Validar que se proporcionó el parámetro career
    if (!career) {
      return NextResponse.json(
        {
          message: "El parámetro 'career' es requerido",
          validCareers: VALID_CAREERS,
        },
        { status: 400 }
      );
    }

    // 3. Validar que la carrera sea válida (opcional pero recomendado)
    if (!VALID_CAREERS.includes(career)) {
      return NextResponse.json(
        {
          message: `La carrera '${career}' no es válida`,
          validCareers: VALID_CAREERS,
        },
        { status: 400 }
      );
    }

    // 4. Consultar usuarios de la carrera específica
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("role", "==", "student"),
      where("career", "==", career),
      orderBy("totalPoints", "desc")
    );

    const querySnapshot = await getDocs(q);

    // 5. Formatear el ranking
    const allUsers = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      
      return {
        id: doc.id,
        name: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Usuario",
        career: data.career || career,
        careerCount: index + 1, // Posición dentro de esta carrera
        points: data.totalPoints || 0,
        globalRank: 0, // Se puede calcular después si se necesita
        avatarUrl: data.avatarUrl || "/images/fox-avatar.png",
      };
    });

    // 6. Aplicar límite si se especificó
    const ranking = maxResults ? allUsers.slice(0, maxResults) : allUsers;

    // 7. Respuesta exitosa
    return NextResponse.json(
      {
        message: `Ranking de ${career} obtenido exitosamente`,
        career: career,
        ranking: ranking,
        count: ranking.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener ranking por carrera:", error);

    // Manejar error específico de índice compuesto
    if (error.code === "failed-precondition") {
      return NextResponse.json(
        {
          message: "Error de configuración de Firestore",
          error: "Se requiere crear un índice compuesto. Revisa la consola de Firebase.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Error al obtener el ranking por carrera",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
