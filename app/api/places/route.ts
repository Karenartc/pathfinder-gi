// Endpoint para obtener la lista de lugares usando Firebase Admin SDK

import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

export async function GET(request: Request) {
  try {
    const token = extractTokenFromHeader(request);
    
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
      console.error("Error al verificar token:", error);
      return NextResponse.json(
        { 
          ok: false,
          message: "Token inválido o expirado.",
        },
        { status: 403 }
      );
    }

    // 3. Obtener todos los lugares activos usando Admin SDK
    const placesRef = adminDb.collection("pointsOfInterest");
    const placesQuery = placesRef.where("isActive", "==", true);

    const querySnapshot = await placesQuery.get();

    // 4. Formatear los lugares
    const places = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || "Sin nombre",
        description: data.description || "",
        image: data.imageUrl || "/images/biblioteca-lugar.jpeg",
        location: data.location || "",
        hours: data.hours || "",
        building: data.building || "",
        room: data.room || "",
        qrCodeUrl: data.qrCodeUrl || "",
      };
    });

    // 5. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Lugares obtenidos exitosamente",
        places: places,
        count: places.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error en API /api/places:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener los lugares.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}