import { NextResponse } from "next/server";
import { db, auth } from "@/libs/firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

// Importar funciones de seguridad y validación
import {
  sanitizeString,
  sanitizeEmail,
  sanitizeRut,
  sanitizePhone,
  containsInjectionPatterns,
  isValidEmail,
  isValidName,
  isValidPhone,
  isValidBirthDate,
  isValidRut,
  isValidPasswordLength,
  passwordsMatch
} from "@/libs/security";

// Interfaz para tipar el body de la petición
interface RegisterBody {
  firstName: string;
  lastName: string;
  birthDate: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  rut: string;
  career?: string;
}

// Función principal de validación
function validateRegisterData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  // Validar que todos los campos requeridos existan y sean strings
  const requiredFields = ['firstName', 'lastName', 'birthDate', 'phone', 'email', 'password', 'confirmPassword', 'rut'];
  
  for (const field of requiredFields) {
    if (!data[field] || typeof data[field] !== 'string') {
      errors.push(`El campo ${field} es requerido y debe ser texto`);
    }
  }

  // Si faltan campos requeridos, retornar inmediatamente
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // Detectar intentos de inyección en todos los campos de texto
  const fieldsToCheck = [
    data.firstName, 
    data.lastName, 
    data.email, 
    data.phone,
    data.rut
  ];
  
  if (data.career) fieldsToCheck.push(data.career);
  
  for (const field of fieldsToCheck) {
    if (containsInjectionPatterns(field)) {
      errors.push('Se detectaron caracteres no permitidos en los datos');
      return { valid: false, errors }; // Rechazar inmediatamente
    }
  }

  // Validación de nombre
  if (!isValidName(data.firstName)) {
    errors.push('Nombre inválido (solo letras, espacios y guiones permitidos)');
  }

  // Validación de apellido
  if (!isValidName(data.lastName)) {
    errors.push('Apellido inválido (solo letras, espacios y guiones permitidos)');
  }

  // Validación de fecha de nacimiento
  if (!isValidBirthDate(data.birthDate)) {
    errors.push('Fecha de nacimiento inválida o debe tener al menos 13 años');
  }

  // Validación de teléfono
  if (!isValidPhone(data.phone)) {
    errors.push('Número de teléfono inválido (formato chileno esperado)');
  }

  // Validación de email
  if (!isValidEmail(data.email)) {
    errors.push('Email inválido');
  }

  // Validación de RUT
  if (!isValidRut(data.rut)) {
    errors.push('RUT inválido (formato o dígito verificador incorrecto)');
  }

  // Validación de contraseña
  if (!isValidPasswordLength(data.password)) {
    errors.push('La contraseña debe tener entre 6 y 128 caracteres');
  }

  // Validar que las contraseñas coincidan
  if (!passwordsMatch(data.password, data.confirmPassword)) {
    errors.push('Las contraseñas no coinciden');
  }

  // Validación de carrera (si existe)
  if (data.career && !isValidName(data.career)) {
    errors.push('Carrera inválida');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function POST(request: Request) {
  try {
    // 1. Parsear el body
    const body: RegisterBody = await request.json();
    
    // 2. Validar todos los datos
    const validation = validateRegisterData(body);
    if (!validation.valid) {
      return NextResponse.json(
        { 
          message: "Datos inválidos", 
          errors: validation.errors 
        }, 
        { status: 400 }
      );
    }

    const { firstName, lastName, birthDate, phone, email, password, rut, career } = body;

    // 3. Crear el usuario en Firebase Authentication
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 4. Sanitizar todos los datos antes de guardar
    const sanitizedFirstName = sanitizeString(firstName);
    const sanitizedLastName = sanitizeString(lastName);
    const fullName = `${sanitizedFirstName} ${sanitizedLastName}`;
    const sanitizedEmail = sanitizeEmail(email);
    const sanitizedRut = sanitizeRut(rut);
    const sanitizedPhone = sanitizePhone(phone);
    const sanitizedCareer = career ? sanitizeString(career) : "";

    // 5. Convertir fecha de nacimiento a formato ISO (YYYY-MM-DD) para Firestore
    const [day, month, year] = birthDate.split('/');
    const birthDateISO = `${year}-${month}-${day}`;

    // 6. Guardar los datos en Firestore
    const userRef = doc(db, "users", user.uid);
    
    await setDoc(userRef, {
      rut: sanitizedRut,
      email: sanitizedEmail,
      firstName: sanitizedFirstName,
      lastName: sanitizedLastName,
      fullName: fullName,
      birthDate: birthDateISO,
      phone: sanitizedPhone,
      role: "student",
      career: sanitizedCareer,
      totalPoints: 0,
      avatarUrl: "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });

    // 7. Respuesta exitosa (sin exponer información sensible)
    return NextResponse.json(
      { 
        message: "Usuario creado con éxito", 
        userId: user.uid
      }, 
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Error en registro:", error);

    // Manejo específico de errores de Firebase Auth
    if (error.code === "auth/email-already-in-use") {
      return NextResponse.json(
        { message: "El correo electrónico ya está registrado." }, 
        { status: 400 }
      );
    }

    if (error.code === "auth/weak-password") {
      return NextResponse.json(
        { message: "La contraseña es muy débil." }, 
        { status: 400 }
      );
    }

    if (error.code === "auth/invalid-email") {
      return NextResponse.json(
        { message: "El formato del correo electrónico es inválido." }, 
        { status: 400 }
      );
    }

    // Error al guardar en Firestore (puede pasar si las reglas lo bloquean)
    if (error.code?.includes('permission-denied')) {
      return NextResponse.json(
        { message: "Error de permisos al guardar datos del usuario." }, 
        { status: 403 }
      );
    }

    // Error genérico
    return NextResponse.json(
      { 
        message: "Error interno del servidor al crear el usuario."
      }, 
      { status: 500 }
    );
  }
}