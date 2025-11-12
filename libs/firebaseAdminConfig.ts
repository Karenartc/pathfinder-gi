import * as admin from "firebase-admin";

if (!admin.apps.length) {
  const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  };

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

export function extractTokenFromHeader(request: Request): string | null {
  const headers = Object.fromEntries(request.headers.entries());
  const authHeader =
    headers["authorization"] ||
    headers["Authorization"] ||
    headers["AUTHORIZATION"];

  if (!authHeader) {
    console.log("⚠️ No se encontró header Authorization:", headers);
    return null;
  }

  if (!authHeader.startsWith("Bearer ")) return null;
  return authHeader.replace("Bearer ", "").trim();
}

export async function verifyAuthToken(token: string) {
  try {
    const decoded = await adminAuth.verifyIdToken(token);
    return { success: true, uid: decoded.uid };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
