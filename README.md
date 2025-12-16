# 🐱 Pomodoro Gatito

Aplicación de técnica Pomodoro con estética pixel-kawaii, sistema de gamificación y sincronización en la nube.

## ✨ Características

### 🍅 Timer Pomodoro
- Sesiones de 25 minutos con descansos de 5/15 minutos
- Contador visual de pomodoros completados
- Barra de progreso animada
- Notificaciones sonoras

### 📚 Gestión de Estudio
- **Materias**: Organiza tus sesiones por materia
- **Exámenes**: Agenda tus exámenes con recordatorios
- **Metas**: Define objetivos con número de pomodoros necesarios
- **Historial**: Registro completo de todas tus sesiones

### 🎮 Gamificación
- **Sistema de XP**: Gana 25 XP por cada pomodoro completado
- **Niveles**: Sube de nivel cada 100 XP
- **Rachas**: Mantén tu racha estudiando días consecutivos
- **8 Logros desbloqueables**:
  - 🎯 Primer Paso (1 pomodoro)
  - 🔥 Día Productivo (5 pomodoros en un día)
  - ⚡ Racha x3 (3 días seguidos)
  - 👑 Racha Legendaria (7 días seguidos)
  - 💪 Compromiso (10 pomodoros)
  - 🏆 Maratón 25 (25 pomodoros)
  - 💎 Maestro del Foco (50 pomodoros)
  - ⭐ Nivel 5 (alcanzar nivel 5)

### 📊 Estadísticas
- Sesiones por día/semana/mes
- Minutos totales de estudio
- Estadísticas por materia

### 📅 Calendario Personalizado
- Datepicker pixel-kawaii custom
- Navegación mes a mes
- Atajos rápidos (Hoy/Mañana)

### ☁️ Sincronización (Opcional)
- **localStorage**: Datos guardados en el navegador
- **Firebase**: Sincronización automática entre dispositivos
- **Exportar/Importar**: Respaldo en formato JSON

## 🚀 Instalación

### Opción 1: Solo localStorage (sin configuración)

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/pomodoro-gatito.git
cd pomodoro-gatito
```

2. Abre `index.html` en tu navegador

¡Listo! La app funcionará solo con localStorage.

### Opción 2: Con Firebase (sincronización en la nube)

#### Paso 1: Crear proyecto Firebase

1. Ve a [Firebase Console](https://console.firebase.google.com/)
2. Crea un nuevo proyecto
3. En la página del proyecto, haz clic en "Agregar app" > "Web"
4. Copia la configuración que aparece

#### Paso 2: Configurar Firebase

1. Abre `firebase-config.js`
2. Reemplaza los valores de `FIREBASE_CONFIG`:

```javascript
const FIREBASE_CONFIG = {
    apiKey: "TU_API_KEY_AQUI",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto-id",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef"
};

// Cambiar a true para habilitar Firebase
const ENABLE_FIREBASE = true;
```

#### Paso 3: Configurar Firestore

1. En Firebase Console, ve a **Build** > **Firestore Database**
2. Haz clic en **Crear base de datos**
3. Selecciona **Modo de producción**
4. Ve a la pestaña **Reglas** y pega esto:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

5. Haz clic en **Publicar**

#### Paso 4: Habilitar autenticación anónima

1. Ve a **Build** > **Authentication**
2. Haz clic en **Comenzar**
3. En la pestaña **Sign-in method**, habilita **Anónimo**

¡Listo! Ahora tu app sincronizará automáticamente cada 30 segundos.

## 📦 Estructura de archivos

```
pomodoro-gatito/
├── index.html          # HTML principal
├── style.css           # Estilos pixel-kawaii
├── app.js              # Lógica principal (Timer, UI, Gamificación)
├── firebase-config.js  # Configuración de Firebase
├── sync.js             # Sincronización automática
├── database.js         # (No usado, reemplazado por sync.js)
└── README.md           # Este archivo
```

## 🎯 Uso

### Timer básico
1. Selecciona una materia (opcional)
2. Haz clic en **▶ INICIAR**
3. Usa **⏸ PAUSA** para pausar
4. Usa **↺ RESET** para reiniciar

### Atajos de teclado
- **Espacio**: Iniciar/Pausar
- **R**: Reset

### Agregar examen
1. Ve a la pestaña **Exámenes**
2. Selecciona materia
3. Haz clic en **CAL** para abrir el calendario
4. Selecciona la fecha
5. Agrega notas (opcional)
6. Haz clic en **+ Agregar Examen**

### Crear meta
1. Ve a la pestaña **Metas**
2. Selecciona materia
3. Describe la meta
4. Define cuántos pomodoros necesitas
5. Haz clic en **+ Agregar Meta**

### Ver estadísticas
1. Ve a la pestaña **Stats**
2. Revisa tus sesiones por día/semana/mes
3. Revisa tu nivel, XP y racha
4. Ve los logros desbloqueados

### Exportar/Importar datos
1. Ve a la pestaña **Config**
2. Haz clic en **📥 Exportar datos** para descargar un JSON
3. Usa **📤 Importar datos** para restaurar desde un archivo

## 🔧 Configuración avanzada

### Cambiar tiempos del Pomodoro

En `app.js`, línea ~515:
```javascript
const times = { pomodoro: 25, short: 5, long: 15 };
```

### Cambiar XP por pomodoro

En `app.js`, línea ~725:
```javascript
this.xpPerPomodoro = 25;
this.xpPerLevel = 100;
```

### Agregar más logros

En `app.js`, línea ~728-737, agrega al array:
```javascript
{
    id: 'mi_logro',
    title: '🌟 Mi Logro',
    desc: 'Descripción del logro',
    condition: (ctx) => ctx.timer.completedPomodoros >= 100
}
```

## 🌐 Deploy en GitHub Pages

1. Sube tu proyecto a GitHub
2. Ve a **Settings** > **Pages**
3. Selecciona la rama **main** y carpeta **/ (root)**
4. Haz clic en **Save**
5. Tu app estará disponible en: `https://tu-usuario.github.io/pomodoro-gatito/`

**Nota**: Firebase funciona perfecto en GitHub Pages, no necesitas servidor.

## 🐛 Troubleshooting

### "Firebase no disponible"
- Verifica que `ENABLE_FIREBASE = true` en `firebase-config.js`
- Verifica que los valores de configuración sean correctos
- Revisa la consola del navegador para más detalles

### "Error de sincronización"
- Verifica tu conexión a internet
- Revisa las reglas de Firestore
- Verifica que la autenticación anónima esté habilitada

### Los datos no se sincronizan
- La sincronización es cada 30 segundos
- Usa el botón **🔄 Sincronizar ahora** en Config para forzar

### Perdí mis datos
- Si usas solo localStorage, los datos se borran al limpiar el navegador
- Usa **📥 Exportar datos** regularmente para hacer respaldos
- Considera habilitar Firebase para respaldo automático

## 📝 Licencia

MIT License - Siéntete libre de usar, modificar y distribuir.

## 🎨 Créditos

- Fuente: [Press Start 2P](https://fonts.google.com/specimen/Press+Start+2P)
- Estética: Pixel art kawaii
- Backend: Firebase (opcional)

---

Hecho con 💖 y mucho ☕ (y pomodoros)
