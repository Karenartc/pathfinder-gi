import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";

export async function GET(request: Request) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token) {
      return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });
    }

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid) {
      return NextResponse.json({ ok: false, message: "Token inválido o expirado", error }, { status: 401 });
    }

    const snapshot = await adminDb
      .collection("events")
      .where("isActive", "==", true)
      .orderBy("startAt", "asc")
      .get();

    if (snapshot.empty) {
      return NextResponse.json({ ok: true, events: [] });
    }

    const events = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        place: data.place,
        description: data.description || "",
        imageUrl: data.imageUrl || "/images/PathFox-eventoDefault.png",
        dateISO:
          data.startAt && data.startAt.toDate
            ? data.startAt.toDate().toISOString()
            : data.dateISO || "",
        startAt: data.startAt || null,
        endAt: data.endAt || null,
      };
    });

    return NextResponse.json({ ok: true, events });
  } catch (err: any) {
    console.error("❌ Error en /api/events:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener los eventos.", error: err.message },
      { status: 500 }
    );
  }
}
