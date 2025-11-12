import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";

export async function GET(request: Request) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token)
      return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });

    const { success, uid } = await verifyAuthToken(token);
    if (!success || !uid)
      return NextResponse.json({ ok: false, message: "Token inválido" }, { status: 401 });

    // 🔹 Obtener módulos activos
    const snap = await adminDb
      .collection("modules")
      .where("isActive", "==", true)
      .orderBy("order", "asc")
      .get();

    const modules = snap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    return NextResponse.json({ ok: true, modules });
  } catch (err: any) {
    console.error("❌ Error en /api/modules:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener módulos", error: err.message },
      { status: 500 }
    );
  }
}
