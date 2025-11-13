import { NextResponse } from "next/server";
import { adminDb, extractTokenFromHeader, verifyAuthToken } from "@/libs/firebaseAdminConfig";
import admin from "firebase-admin";

export async function GET(request: Request) {
  try {
    const token = extractTokenFromHeader(request);
    if (!token) return NextResponse.json({ ok: false, message: "No token" }, { status: 401 });

    const { success, uid } = await verifyAuthToken(token);
    if (!success || !uid) {
      return NextResponse.json({ ok: false, message: "Token inválido" }, { status: 401 });
    }

    // USERS
    const usersSnap = await adminDb.collection("users").get();
    const users = usersSnap.docs.map(
      (doc: admin.firestore.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    // MODULES
    const modulesSnap = await adminDb.collection("modules").get();

    // Obtener todos los progress de todos los usuarios
    const allProgressSnap = await adminDb.collectionGroup("lessonProgress").get();

    const progressByModule: Record<string, number[]> = {};

    allProgressSnap.docs.forEach((p) => {
      const data = p.data();
      if (!data.moduleId || data.progress == null) return;

      if (!progressByModule[data.moduleId]) {
        progressByModule[data.moduleId] = [];
      }
      progressByModule[data.moduleId].push(data.progress);
    });

    const modules = modulesSnap.docs.map((doc) => {
      const moduleData = doc.data();
      const moduleId = doc.id;

      const progresses = progressByModule[moduleId] || [];
      const avgProgress =
        progresses.length > 0
          ? Math.round(
              progresses.reduce((sum, v) => sum + v, 0) / progresses.length
            )
          : 0;

      return {
        id: moduleId,
        title: moduleData.name || moduleData.title || "Sin título",
        progress: avgProgress,
      };
    });

    // EVENTS
    const eventsSnap = await adminDb.collection("events").get();
    const events = eventsSnap.docs.map(
      (doc: admin.firestore.QueryDocumentSnapshot) => ({
        id: doc.id,
        ...doc.data(),
      })
    );

    return NextResponse.json({
      ok: true,
      users,
      modules,
      events,
    });
  } catch (err: any) {
    console.error("Error cargando dashboard admin:", err);
    return NextResponse.json(
      { ok: false, message: "Error al obtener datos del dashboard", error: err.message },
      { status: 500 }
    );
  }
}
