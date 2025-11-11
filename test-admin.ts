import { adminAuth, adminDb } from './libs/firebaseAdminConfig';

async function testAdmin() {
  try {
    console.log('🔍 Probando conexión a Firebase Admin SDK...\n');
    
    // Probar conexión a Firestore
    const usersSnapshot = await adminDb.collection('users').limit(1).get();
    console.log('✅ Conexión a Firestore exitosa');
    console.log('📊 Usuarios encontrados:', usersSnapshot.size);
    
    if (usersSnapshot.size > 0) {
      const firstUser = usersSnapshot.docs[0].data();
      console.log('👤 Primer usuario:', firstUser.email || firstUser.fullName);
    }
    
    // Probar Auth
    const userRecord = await adminAuth.getUserByEmail('maria.torres@test.com');
    console.log('\n✅ Conexión a Auth exitosa');
    console.log('👤 Usuario encontrado:', userRecord.email);
    console.log('🆔 UID:', userRecord.uid);
    
    console.log('\n🎉 ¡Todo funciona correctamente!');
    
  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    console.error('💡 Detalles:', error);
  }
}

testAdmin();