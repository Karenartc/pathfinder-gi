import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    // 1. Obtener el userId del header
    const userId = request.headers.get("X-User-Id");

    if (!userId) {
      return NextResponse.json(
        { message: "ID de usuario no proporcionado." },
        { status: 400 }
      );
    }

    // 2. Obtener las notificaciones del usuario
    const notificationsRef = collection(db, "users", userId, "notifications");
    const q = query(
      notificationsRef,
      orderBy("createdAt", "desc") // Más recientes primero
    );

    const querySnapshot = await getDocs(q);

    // 3. Formatear las notificaciones
    const notifications = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        message: data.message || "",
        type: data.type || "system",
        dateISO: data.dateISO || data.createdAt?.toDate?.()?.toISOString() || "",
        read: data.read ?? false,
        link: data.link || null,
      };
    });

    // 4. Contar notificaciones no leídas
    const unreadCount = notifications.filter((n) => !n.read).length;

    // 5. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Notificaciones obtenidas exitosamente",
        notifications: notifications,
        count: notifications.length,
        unreadCount: unreadCount,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener notificaciones:", error);

    return NextResponse.json(
      {
        message: "Error al obtener las notificaciones.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}