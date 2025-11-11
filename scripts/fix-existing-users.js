/**
 * Script para arreglar usuarios existentes
 * Ejecutar: node scripts/fix-existing-users.js
 */

const admin = require('firebase-admin');
const path = require('path');

// Cargar service account key desde la raíz del proyecto
const serviceAccount = require(path.join(__dirname, '..', 'serviceAccountKey.json'));

// Inicializar Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function fixExistingUsers() {
  console.log('🔧 Arreglando usuarios existentes...\n');

  try {
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No hay usuarios para arreglar.');
      return;
    }

    console.log(`📊 Usuarios encontrados: ${usersSnapshot.size}\n`);

    let fixedCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const userData = userDoc.data();

      try {
        const updates = {};

        // Agregar uid si no existe
        if (!userData.uid) {
          updates.uid = userId;
        }

        // Agregar timestamps como strings si no existen
        if (!userData.createdAt) {
          updates.createdAt = new Date().toISOString();
        }
        if (!userData.updatedAt) {
          updates.updatedAt = new Date().toISOString();
        }

        // Agregar avatar por defecto si no existe
        if (!userData.avatarUrl) {
          updates.avatarUrl = '/images/fox-avatar.png';
        }

        // Agregar preferences si no existen
        if (!userData.preferences) {
          updates.preferences = {
            darkMode: false,
            notificationsEnabled: true,
          };
        }

        // Asegurar que totalPoints exista
        if (userData.totalPoints === undefined || userData.totalPoints === null) {
          updates.totalPoints = 0;
        }

        // Asegurar que role sea "student"
        if (!userData.role) {
          updates.role = 'student';
        }

        // Si hay algo que actualizar
        if (Object.keys(updates).length > 0) {
          await db.collection('users').doc(userId).update(updates);
          console.log(`✅ ${userData.fullName || userData.email} - Campos agregados: ${Object.keys(updates).join(', ')}`);
          fixedCount++;
        } else {
          console.log(`⏭️  ${userData.fullName || userData.email} - Sin cambios necesarios`);
        }

      } catch (error) {
        console.error(`❌ Error con usuario ${userId}:`, error);
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log(`✅ Usuarios arreglados: ${fixedCount}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('\n💥 Error:', error);
  }
}

fixExistingUsers()
  .then(() => {
    console.log('\n🎉 ¡Listo!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Error fatal:', error);
    process.exit(1);
  });