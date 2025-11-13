// Endpoint para obtener el detalle de un lugar específico usando Firebase Admin SDK

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

type RouteParams = {
  params: Promise<{ id: string }>;
};

export async function GET(request: Request, { params }: RouteParams) {
  try {

    const { id } = await params;

    // 1. Verificar token
    const token = extractTokenFromHeader(request);

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

    // 3. Obtener el ID del lugar
    //const { id } = await params;

    // 4. Buscar el documento en Firestore usando Admin SDK
    const placeRef = adminDb.collection("pointsOfInterest").doc(id);
    const placeDoc = await placeRef.get();

    // 5. Verificar si existe
    if (!placeDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Lugar no encontrado." },
        { status: 404 }
      );
    }

    const data = placeDoc.data();
    if (!data) {
      return NextResponse.json(
        { ok: false, message: "Lugar sin datos." },
        { status: 404 }
      );
    }

    // 6. Formatear la respuesta
    const place = {
      id: placeDoc.id,
      name: data.name || "Sin nombre",
      description: data.description || "",
      image: data.imageUrl || "/images/biblioteca-lugar.jpeg",
      location: data.location || "",
      hours: data.hours || "",
      building: data.building || "",
      room: data.room || "",
      qrCodeUrl: data.qrCodeUrl || "",
      coordinates: data.coordinates || null,
    };

    // 7. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Lugar obtenido exitosamente",
        place: place,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener lugar:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener el lugar.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
