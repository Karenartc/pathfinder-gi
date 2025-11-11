import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";

/**
 * GET /api/ranking/global
 * 
 * Retorna el ranking global de todos los estudiantes ordenados por totalPoints.
 * Calcula dinámicamente la posición de cada estudiante dentro de su carrera (careerCount).
 * 
 * Query params opcionales:
 * - limit: número máximo de resultados (default: 100)
 * 
 * Respuesta:
 * {
 *   message: string,
 *   ranking: User[],
 *   count: number
 * }
 */
export async function GET(request: Request) {
  try {
    // 1. Obtener parámetros de query
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get("limit");
    const maxResults = limitParam ? parseInt(limitParam) : 100;

    // 2. Obtener TODOS los estudiantes ordenados por puntos
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("role", "==", "student"),
      orderBy("totalPoints", "desc")
    );

    const querySnapshot = await getDocs(q);

    // 3. Agrupar usuarios por carrera para calcular careerCount
    const usersByCareer: Record<string, number> = {};

    // 4. Formatear el ranking con posiciones calculadas
    const allUsers = querySnapshot.docs.map((doc, index) => {
      const data = doc.data();
      const career = data.career || "Sin carrera";

      // Incrementar contador de posición por carrera
      if (!usersByCareer[career]) {
        usersByCareer[career] = 0;
      }
      usersByCareer[career]++;

      return {
        id: doc.id,
        name: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Usuario",
        career: career,
        careerCount: usersByCareer[career], // Posición dentro de su carrera
        points: data.totalPoints || 0,
        globalRank: index + 1, // Posición global
        avatarUrl: data.avatarUrl || "/images/fox-avatar.png",
      };
    });

    // 5. Aplicar límite si se especificó
    const ranking = maxResults ? allUsers.slice(0, maxResults) : allUsers;

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Ranking global obtenido exitosamente",
        ranking: ranking,
        count: ranking.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener ranking global:", error);

    return NextResponse.json(
      {
        message: "Error al obtener el ranking global",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
