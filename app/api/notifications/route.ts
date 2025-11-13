/// Endpoint para obtener notificaciones del usuario usando Firebase Admin SDK

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
    console.log(`✅ Usuario autenticado en notificaciones: ${userId}`);

    // 3. Obtener las notificaciones del usuario (usando Admin SDK)
    const notificationsRef = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications");
    
    // Intentar ordenar por diferentes campos (sentAt o createdAt)
    let notificationsQuery;
    try {
      notificationsQuery = notificationsRef.orderBy("sentAt", "desc");
    } catch {
      try {
        notificationsQuery = notificationsRef.orderBy("createdAt", "desc");
      } catch {
        notificationsQuery = notificationsRef;
      }
    }

    const querySnapshot = await notificationsQuery.get();
    console.log(`🔔 Notificaciones encontradas: ${querySnapshot.size}`);

    // 4. Formatear las notificaciones (soportar múltiples formatos)
    const notifications = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      
      // Manejar diferentes formatos de mensaje
      const message = data.message || data.body || "";
      const title = data.title || "";
      const fullMessage = title ? `${title}: ${message}` : message;
      
      // Manejar diferentes formatos de fecha
      let dateISO = "";
      if (data.dateISO) {
        dateISO = data.dateISO;
      } else if (data.sentAt) {
        // sentAt puede ser timestamp o string
        if (data.sentAt.toDate) {
          dateISO = data.sentAt.toDate().toISOString();
        } else if (typeof data.sentAt === 'string') {
          dateISO = data.sentAt;
        }
      } else if (data.createdAt) {
        if (data.createdAt.toDate) {
          dateISO = data.createdAt.toDate().toISOString();
        } else if (typeof data.createdAt === 'string') {
          dateISO = data.createdAt;
        }
      }
      
      // Manejar diferentes formatos de "leído"
      const read = data.read ?? data.isRead ?? false;

      return {
        id: doc.id,
        message: fullMessage,
        type: data.type || "system",
        dateISO: dateISO,
        read: read,
        link: data.link || null,
      };
    });

    // 5. Contar notificaciones no leídas
    const unreadCount = notifications.filter((n) => !n.read).length;

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        ok: true,
        message: "Notificaciones obtenidas exitosamente",
        notifications: notifications,
        count: notifications.length,
        unreadCount: unreadCount,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("❌ Error en API /api/notifications:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al obtener las notificaciones.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}