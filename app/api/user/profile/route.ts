import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";

/* ─────────────────────────────────────────────
   GET /api/user/profile
   🔒 Protegido por token Firebase
   Devuelve los datos del usuario autenticado
────────────────────────────────────────────── */
export async function GET(request: Request) {
  try {
    // 1️⃣ Verificar autenticación (misma lógica que events/progress)
    const token = extractTokenFromHeader(request);
    console.log("🔍 Token recibido:", token ? "✅ sí" : "❌ no");
    if (!token) {
      return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });
    }

    const { success, uid, error } = await verifyAuthToken(token);
    if (!success || !uid) {
      return NextResponse.json({ ok: false, message: "Token inválido o expirado", error }, { status: 401 });
    }

    // 2️⃣ Obtener documento del usuario en Firestore
    const userSnap = await adminDb.collection("users").doc(uid).get();
    if (!userSnap.exists) {
      return NextResponse.json({ ok: false, message: "Usuario no encontrado" }, { status: 404 });
    }

    const userData = userSnap.data();

    return NextResponse.json({
      ok: true,
      user: { uid, ...userData },
    });
  } catch (err: any) {
    console.error("❌ Error en /api/user/profile:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener perfil del usuario", error: err.message },
      { status: 500 }
    );
  }
}
