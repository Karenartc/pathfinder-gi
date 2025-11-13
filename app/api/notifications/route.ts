import { NextResponse } from "next/server";
import { adminAuth, adminDb, extractTokenFromHeader } from "@/libs/firebaseAdminConfig";

export async function GET(request: Request) {
  try {
    const token = extractTokenFromHeader(request);

    if (!token) {
      return NextResponse.json(
        { ok: false, message: "No se proporcionó token." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json(
        { ok: false, message: "Token inválido o expirado." },
        { status: 403 }
      );
    }

    const userId = decoded.uid;

    const ref = adminDb
      .collection("users")
      .doc(userId)
      .collection("notifications");

    let q;
    try {
      q = ref.orderBy("createdAt", "desc");
    } catch {
      try {
        q = ref.orderBy("sentAt", "desc");
      } catch {
        q = ref;
      }
    }

    const snap = await q.get();

    const notifications = snap.docs.map((doc) => {
      const data = doc.data();

      // MENSAJE UNIFICADO
      const fullMessage = data.title
        ? `${data.title}: ${data.message || data.body || ""}`
        : data.message || data.body || "";

      // FECHA UNIFICADA
      let dateISO = new Date().toISOString();
      const ts = data.createdAt || data.sentAt || data.dateISO;

      if (ts?.toDate) dateISO = ts.toDate().toISOString();
      else if (typeof ts === "string") dateISO = ts;

      // LECTURA UNIFICADA
      const read = data.read ?? data.isRead ?? data.visto ?? false;

      return {
        id: doc.id,
        message: fullMessage,
        type: data.type || "system",
        dateISO,
        read,
        link: data.link || null,
      };
    });

    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json(
      {
        ok: true,
        notifications,
        unreadCount,
        count: notifications.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    return NextResponse.json(
      { ok: false, message: "Error interno.", error: error.message },
      { status: 500 }
    );
  }
}
