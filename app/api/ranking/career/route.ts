// Endpoint para obtener el ranking por carrera usando Firebase Admin SDK

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

    // 2. Verificar el token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      console.log(`✅ Usuario autenticado en ranking por carrera: ${decodedToken.uid}`);
    } catch (error: any) {
      console.error("❌ Error al verificar token:", error);
      return NextResponse.json(
        { 
          ok: false,
          message: "Token inválido o expirado.",
        },
        { status: 403 }
      );
    }

    // 3. Obtener el parámetro de carrera desde la URL
    const { searchParams } = new URL(request.url);
    const career = searchParams.get("career");

    if (!career) {
      return NextResponse.json(
        { 
          ok: false,
          message: "Se requiere especificar una carrera." 
        },
        { status: 400 }
      );
    }

    console.log(`🎓 Buscando ranking para carrera: ${career}`);

    // 4. Obtener usuarios de la carrera ordenados por puntos (usando Admin SDK)
    const usersRef = adminDb.collection("users");
    const usersQuery = usersRef
      .where("career", "==", career)
      .orderBy("totalPoints", "desc")
      .limit(100); // Top 100 de la carrera

    const usersSnapshot = await usersQuery.get();
    console.log(`🏆 Usuarios en ranking de ${career}: ${usersSnapshot.size}`);

    // 5. Formatear el ranking con posiciones por carrera
    const ranking = usersSnapshot.docs.map((doc, index) => {
      const data = doc.data();
      return {
        id: doc.id,
        careerRank: index + 1, // Posición en el ranking de la carrera
        careerCount: index + 1, // Alias para compatibilidad
        fullName: data.fullName || `${data.firstName || ""} ${data.lastName || ""}`.trim() || "Usuario",
        career: data.career || "Sin carrera",
        totalPoints: data.totalPoints || 0,
        avatarUrl: data.avatarUrl || "/images/fox-avatar.png",
      };
    });

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: `Ranking de ${career} obtenido exitosamente`,
        career: career,
        ranking: ranking,
        count: ranking.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error en API /api/ranking/career:", error);

    // Error específico de índice faltante
    if (error.code === 'failed-precondition' || error.message?.includes('index')) {
      return NextResponse.json(
        {
          ok: false,
          message: "Se requiere crear un índice en Firestore.",
          error: "Missing index",
          indexUrl: error.message.match(/https:\/\/[^\s]+/)?.[0] || null,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener el ranking por carrera.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
