import * as admin from 'firebase-admin';

// Inicializar solo una vez
if (!admin.apps.length) {
  try {
    // Cargar el service account
    const serviceAccount = require('../serviceAccountKey.json');
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    
    console.log('✅ Firebase Admin SDK inicializado');
  } catch (error: any) {
    console.error('❌ Error inicializando Admin SDK:', error.message);
    throw error;
  }
}

// Exportar instancias
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

// Helper para extraer token
export function extractTokenFromHeader(authHeader: string | null): string | null {
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  return authHeader.substring(7); // Remueve "Bearer "
}

// Helper para verificar token
export async function verifyAuthToken(token: string) {
  try {
    const decodedToken = await adminAuth.verifyIdToken(token);
    return {
      success: true,
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message,
    };
  }
}