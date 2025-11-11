// Endpoint para obtener la lista de eventos usando Firebase Admin SDK

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
      console.log(`✅ Usuario autenticado en /api/events: ${decodedToken.uid}`);
    } catch (error: any) {
      console.error("❌ Error al verificar token:", error);
      return NextResponse.json(
        { 
          ok: false,
          message: "Token inválido o expirado.",
          error: error.code 
        },
        { status: 403 }
      );
    }

    // 3. Obtener todos los eventos activos (usando Admin SDK)
    const eventsRef = adminDb.collection("events");
    const eventsQuery = eventsRef
      .where("isActive", "==", true)
      .orderBy("dateISO", "asc");

    const eventsSnapshot = await eventsQuery.get();
    console.log(`📅 Eventos encontrados: ${eventsSnapshot.size}`);

    // 4. Formatear los eventos
    const events = eventsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || "Sin título",
        description: data.description || "",
        dateISO: data.dateISO || "",
        place: data.place || "Por confirmar",
        image: data.imageUrl || "/images/default-event.jpg",
        category: data.category || "general",
        building: data.building || "",
        room: data.room || "",
      };
    });

    // 5. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Eventos obtenidos exitosamente",
        events: events,
        count: events.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error en API /api/events:", error);

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
        message: "Error al obtener los eventos.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}