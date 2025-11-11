import { NextResponse } from "next/server";
import { db } from "@/libs/firebaseConfig";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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

    // 2. Obtener los logros desbloqueados por el usuario
    const unlockedRef = collection(db, "users", userId, "unlockedAchievements");
    const unlockedSnapshot = await getDocs(unlockedRef);

    // 3. Para cada logro desbloqueado, obtener la info completa
    const achievements = await Promise.all(
      unlockedSnapshot.docs.map(async (unlockedDoc) => {
        const unlockedData = unlockedDoc.data();

        // Obtener info completa del logro desde la colección global
        const achievementRef = doc(db, "achievements", unlockedDoc.id);
        const achievementDoc = await getDoc(achievementRef);

        if (!achievementDoc.exists()) {
          return null; // Si no existe el logro global, lo omitimos
        }

        const achievementData = achievementDoc.data();

        return {
          id: achievementDoc.id,
          name: achievementData.name || "Logro sin nombre",
          description: achievementData.description || "",
          pointsAwarded: achievementData.pointsAwarded || 0,
          iconUrl: achievementData.iconUrl || "/images/achievements/default.png",
          dateUnlocked: unlockedData.dateUnlocked?.toDate?.()?.toISOString() || null,
        };
      })
    );

    // 4. Filtrar logros nulos (por si alguno no existe)
    const validAchievements = achievements.filter((a) => a !== null);

    // 5. Ordenar por fecha de desbloqueo (más reciente primero)
    validAchievements.sort((a, b) => {
      if (!a.dateUnlocked) return 1;
      if (!b.dateUnlocked) return -1;
      return new Date(b.dateUnlocked).getTime() - new Date(a.dateUnlocked).getTime();
    });

    // 6. Respuesta exitosa
    return NextResponse.json(
      {
        message: "Logros obtenidos exitosamente",
        achievements: validAchievements,
        count: validAchievements.length,
      },
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error al obtener logros:", error);

    return NextResponse.json(
      {
        message: "Error al obtener los logros.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}