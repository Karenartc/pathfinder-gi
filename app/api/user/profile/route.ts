import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export async function GET(request: Request) {
  try {
    // 1. Obtener el token del header Authorization
    const authHeader = request.headers.get("Authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { message: "No autorizado. Token faltante." },
        { status: 401 }
      );
    }

    // 2. Extraer el userId del token (por ahora lo tomamos del localStorage en el frontend)
    // En producción, deberías verificar el token con Firebase Admin
    // Por ahora, asumimos que el frontend envía el userId en el header
    const userId = request.headers.get("X-User-Id");

    if (!userId) {
      return NextResponse.json(
        { message: "ID de usuario no proporcionado." },
        { status: 400 }
      );
    }

    // 3. Obtener los datos del usuario desde Firestore
    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { message: "Usuario no encontrado." },
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // 4. Formatear la respuesta según lo que espera el frontend
    const userProfile = {
      id: userDoc.id,
      name: userData.fullName,
      firstName: userData.firstName,
      lastName: userData.lastName,
      career: userData.career || "",
      careerRank: userData.careerRank || 0,
      careerCount: userData.careerRank || 0, // Alias para compatibilidad con mock
      points: userData.totalPoints || 0,
      globalRank: userData.globalRank || 0,
      email: userData.email,
      avatarUrl: userData.avatarUrl || "/images/fox-avatar.png",
      preferences: {
        darkMode: userData.preferences?.darkMode ?? false,
        notificationsEnabled: userData.preferences?.notificationsEnabled ?? true,
      },
    };

    // 5. Respuesta exitosa
    return NextResponse.json(
      { 
        message: "Perfil obtenido exitosamente",
        user: userProfile 
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener perfil:", error);

    return NextResponse.json(
      { 
        message: "Error al obtener el perfil del usuario.",
        error: error.message 
      },
      { status: 500 }
    );
  }
}