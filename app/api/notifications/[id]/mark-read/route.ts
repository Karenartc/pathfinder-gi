// Endpoint para marcar una notificación específica como leída
import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
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
        },
        { status: 403 }
      );
    }

    const userId = decodedToken.uid;
    const notificationId = params.id;

    console.log(`📝 Marcando notificación ${notificationId} como leída para usuario ${userId}`);

    // 3. Obtener la referencia a la notificación
    const notificationRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .doc(notificationId);

    // 4. Verificar si la notificación existe
    const notificationDoc = await notificationRef.get();
    
    if (!notificationDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Notificación no encontrada." },
        { status: 404 }
      );
    }

    // 5. Actualizar el campo correcto (read o isRead dependiendo del formato)
    const data = notificationDoc.data();
    const updateField = data?.isRead !== undefined ? "isRead" : "read";

    await notificationRef.update({
      [updateField]: true,
      readAt: new Date().toISOString(), // Timestamp de cuándo se leyó
    });

    console.log(`✅ Notificación ${notificationId} marcada como leída`);

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Notificación marcada como leída exitosamente",
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error al marcar notificación como leída:", error);
    return NextResponse.json(
      {
        ok: false,
        message: "Error al marcar la notificación como leída.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}