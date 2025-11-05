// UTILIDADES DE SEGURIDAD Y VALIDACIÓN

// Sanitizar strings: elimina caracteres peligrosos
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>"'`]/g, '') // Elimina caracteres peligrosos para XSS
    .replace(/\\/g, '') // Elimina backslashes
    .substring(0, 500); // Limita longitud máxima
}

// Validar que no contenga patrones de inyección
export function containsInjectionPatterns(input: string): boolean {
  const dangerousPatterns = [
    /<script/i,
    /javascript:/i,
    /on\w+\s*=/i, // onerror=, onclick=, etc.
    /\$\{/g, // Template injection
    /\{\{/g, // Template injection
    /eval\(/i,
    /exec\(/i,
    /system\(/i,
    /\.\.\//, // Path traversal
    /\.\.\\/,
  ];

  return dangerousPatterns.some(pattern => pattern.test(input));
}

// Validar email de forma estricta
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Validar que el nombre solo contenga caracteres permitidos
export function isValidName(name: string): boolean {
  // Solo letras, espacios, guiones y apóstrofes (para nombres compuestos)
  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s'-]+$/;
  return nameRegex.test(name) && name.length >= 2 && name.length <= 50;
}

// Validar teléfono chileno (+569 o 9 dígitos)
export function isValidPhone(phone: string): boolean {
  // Acepta formatos: +56912345678, 912345678, 56912345678
  const phoneRegex = /^(\+?56)?9\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

// Validar fecha de nacimiento (dd/mm/aaaa)
export function isValidBirthDate(date: string): boolean {
  // Formato dd/mm/aaaa
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  
  if (!dateRegex.test(date)) {
    return false;
  }

  // Validar que sea una fecha real
  const [day, month, year] = date.split('/').map(Number);
  const dateObj = new Date(year, month - 1, day);
  
  // Verificar que la fecha sea válida
  if (dateObj.getDate() !== day || dateObj.getMonth() !== month - 1 || dateObj.getFullYear() !== year) {
    return false;
  }

  // Verificar que tenga al menos 16 años
  const today = new Date();
  const age = today.getFullYear() - year;
  const monthDiff = today.getMonth() - (month - 1);
  const dayDiff = today.getDate() - day;

  let calculatedAge = age;
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    calculatedAge--;
  }

  return calculatedAge >= 16 && calculatedAge <= 100;
}

// Función para validar RUT chileno (formato + dígito verificador)
// Acepta formatos: 11111111-1 o 11.111.111-1
export function isValidRut(rut: string): boolean {
  // 1. Limpiar el RUT: remover puntos y espacios
  const cleanRut = rut.replace(/\./g, '').replace(/\s/g, '').trim();
  
  // 2. Validar formato básico (con o sin puntos)
  const rutRegex = /^[0-9]{7,8}-[0-9kK]{1}$/;
  if (!rutRegex.test(cleanRut)) {
    return false;
  }

  // 3. Separar número y dígito verificador
  const [rutNumber, dvProvided] = cleanRut.split('-');
  
  // 4. Calcular el dígito verificador real usando algoritmo Módulo 11
  let sum = 0;
  let multiplier = 2;

  // Recorremos el RUT de derecha a izquierda
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }

  const remainder = sum % 11;
  const calculatedDv = 11 - remainder;

  // 5. Convertir el dígito verificador calculado a string
  let dvExpected: string;
  if (calculatedDv === 11) {
    dvExpected = '0';
  } else if (calculatedDv === 10) {
    dvExpected = 'K';
  } else {
    dvExpected = calculatedDv.toString();
  }

  // 6. Comparar (case-insensitive para la K)
  return dvProvided.toUpperCase() === dvExpected.toUpperCase();
}

// Validar longitud de contraseña
export function isValidPasswordLength(password: string): boolean {
  return password.length >= 6 && password.length <= 128;
}

// Validar fortaleza de contraseña (opcional, más estricto)
export function isStrongPassword(password: string): boolean {
  // Al menos 8 caracteres, 1 mayúscula, 1 minúscula, 1 número
  const strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return strongRegex.test(password);
}

// Validar que dos contraseñas coincidan
export function passwordsMatch(password: string, confirmPassword: string): boolean {
  return password === confirmPassword && password.length > 0;
}

// Sanitizar y normalizar RUT (quita puntos y espacios)
export function sanitizeRut(rut: string): string {
  return rut.replace(/\./g, '').replace(/\s/g, '').trim();
}

// Sanitizar y normalizar email
export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// Sanitizar teléfono (quita espacios y caracteres especiales excepto +)
export function sanitizePhone(phone: string): string {
  return phone.replace(/\s/g, '').trim();
}