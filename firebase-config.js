// ==========================================
// FIREBASE CONFIGURATION
// ==========================================
// Instrucciones de configuración:
// 1. Ve a https://console.firebase.google.com/
// 2. Crea un nuevo proyecto (o usa uno existente)
// 3. Ve a "Project Settings" > "Your apps" > "Web app"
// 4. Copia la configuración y reemplaza los valores de FIREBASE_CONFIG
// 5. Habilita Firestore Database en "Build" > "Firestore Database"
// 6. Configura las reglas de seguridad (ver abajo)

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyAMzPgBi7fSQZ70mVUTGyElqZ-zwVqqX7Y",
    authDomain: "pomodoro-gatito.firebaseapp.com",
    projectId: "pomodoro-gatito",
    storageBucket: "pomodoro-gatito.firebasestorage.app",
    messagingSenderId: "376235825686",
    appId: "1:376235825686:web:1087da0055892c5d6f7337",
    measurementId: "G-9VNSFE9QMB"
};

// Habilitar/deshabilitar Firebase (false = solo localStorage)
const ENABLE_FIREBASE = true;

// ==========================================
// REGLAS DE SEGURIDAD PARA FIRESTORE
// ==========================================
/*
Copia estas reglas en Firebase Console > Firestore Database > Rules:

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir acceso a usuarios autenticados anónimamente
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
*/
