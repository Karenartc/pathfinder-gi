import { NextResponse } from "next/server";
import { adminDb } from "@/libs/firebaseAdminConfig";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // ✅ Esperar los params

    const docRef = adminDb.collection("events").doc(id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return NextResponse.json(
        { ok: false, message: "Evento no encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      event: { id: docSnap.id, ...docSnap.data() },
    });
  } catch (err: any) {
    console.error("❌ Error en /api/events/[id]:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener el evento", error: err.message },
      { status: 500 }
    );
  }
}
