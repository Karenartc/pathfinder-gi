// Endpoint para obtener el detalle de un evento específico usando Firebase Admin SDK

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
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
    } catch (error: any) {
      return NextResponse.json(
        { 
          ok: false,
          message: "Token inválido o expirado.",
        },
        { status: 403 }
      );
    }

    // 3. Obtener el ID del evento
    const { id } = await params;

    // 4. Buscar el documento en Firestore usando Admin SDK
    const eventRef = adminDb.collection("events").doc(id);
    const eventDoc = await eventRef.get();

    // 5. Verificar si existe
    if (!eventDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Evento no encontrado." },
        { status: 404 }
      );
    }

    const data = eventDoc.data();
    if (!data) {
      return NextResponse.json(
        { ok: false, message: "Evento sin datos." },
        { status: 404 }
      );
    }

    // 6. Formatear la respuesta
    const event = {
      id: eventDoc.id,
      title: data.title || "Sin título",
      description: data.description || "",
      dateISO: data.dateISO || "",
      place: data.place || "Por confirmar",
      image: data.imageUrl || "/images/default-event.jpg",
      category: data.category || "general",
      building: data.building || "",
      room: data.room || "",
      isActive: data.isActive || false,
    };

    // 7. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Evento obtenido exitosamente",
        event: event,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error al obtener evento:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener el evento.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}