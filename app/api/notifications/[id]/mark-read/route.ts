import { NextResponse, type NextRequest } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  // ⬇️ ESTA ES LA CLAVE PARA QUE COMPILACIÓN FUNCIONE
  const { id: notificationId } = await context.params;

  try {
    const token = extractTokenFromHeader(request);
    
    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No se proporcionó token de autenticación." },
        { status: 401 }
      );
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error: any) {
      console.error("Error al verificar token:", error);
      return NextResponse.json(
        { ok: false, message: "Token inválido o expirado." },
        { status: 403 }
      );
    }

    const userId = decodedToken.uid;

    console.log(`📝 Marcando notificación ${notificationId} como leída para usuario ${userId}`);

    const notificationRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications")
      .doc(notificationId);

    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return NextResponse.json(
        { ok: false, message: "Notificación no encontrada." },
        { status: 404 }
      );
    }

    const data = notificationDoc.data();
    const updateField = data?.isRead !== undefined ? "isRead" : "read";

    await notificationRef.update({
      [updateField]: true,
      readAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true, message: "Notificación marcada como leída exitosamente" },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al marcar notificación como leída:", error);
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
