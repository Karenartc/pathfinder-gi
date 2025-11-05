import { NextResponse } from "next/server"; 
import { auth, db } from "@/libs/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

// Importar funciones de seguridad
import {
  sanitizeEmail,
  containsInjectionPatterns,
  isValidEmail
} from "@/libs/security";

// Interfaz para tipar el body de la petición
interface LoginBody {
  email: string;
  password: string;
}

// Función de validación
function validateLoginData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar que los campos existan y sean strings
  if (!data.email || typeof data.email !== 'string') {
    errors.push('El email es requerido');
  }

  if (!data.password || typeof data.password !== 'string') {
    errors.push('La contraseña es requerida');
  }

  // Si faltan campos, retornar inmediatamente
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Detectar intentos de inyección
  if (containsInjectionPatterns(data.email)) {
    errors.push('Se detectaron caracteres no permitidos en el email');
    return { valid: false, errors };
  }

  // Validación de email
  if (!isValidEmail(data.email)) {
    errors.push('Email inválido');
  }

  // Validación básica de contraseña
  if (data.password.length < 6) {
    errors.push('Contraseña inválida');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function POST(request: Request) {
  try {
    // 1. Parsear el body
    const body: LoginBody = await request.json();
    
    // 2. Validar los datos
    const validation = validateLoginData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          message: "Datos inválidos", 
          errors: validation.errors 
        }, 
        { status: 400 }
      );
    }

    const { email, password } = body;

    // 3. Sanitizar email
    const sanitizedEmail = sanitizeEmail(email);

    // 4. Autenticar con Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(auth, sanitizedEmail, password);
    const user = userCredential.user;

    // 5. Obtener datos adicionales del usuario desde Firestore
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (!userDoc.exists()) {
      return NextResponse.json(
        { message: "Usuario no encontrado en la base de datos." }, 
        { status: 404 }
      );
    }

    const userData = userDoc.data();

    // 6. Obtener el token de autenticación
    const idToken = await user.getIdToken();

    // 7. Respuesta exitosa con datos del usuario (sin información sensible)
    return NextResponse.json(
      { 
        message: "Inicio de sesión exitoso",
        user: {
          uid: user.uid,
          email: user.email,
          fullName: userData.fullName,
          firstName: userData.firstName,
          lastName: userData.lastName,
          role: userData.role,
          avatarUrl: userData.avatarUrl || "",
          totalPoints: userData.totalPoints || 0,
          career: userData.career || ""
        },
        token: idToken
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error("Error en login:", error);

    // Manejo específico de errores de Firebase Auth
    if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
      return NextResponse.json(
        { message: "Email o contraseña incorrectos." }, 
        { status: 401 }
      );
    }

    if (error.code === "auth/user-not-found") {
      return NextResponse.json(
        { message: "No existe una cuenta con este email." }, 
        { status: 401 }
      );
    }

    if (error.code === "auth/too-many-requests") {
      return NextResponse.json(
        { message: "Demasiados intentos fallidos. Intenta más tarde." }, 
        { status: 429 }
      );
    }

    if (error.code === "auth/user-disabled") {
      return NextResponse.json(
        { message: "Esta cuenta ha sido deshabilitada." }, 
        { status: 403 }
      );
    }

    // Error genérico
    return NextResponse.json(
      { 
        message: "Error al iniciar sesión. Intenta nuevamente."
      }, 
      { status: 500 }
    );
  }
}