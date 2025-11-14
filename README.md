# PathFinder GI

> **¡Haz más fácil tu primer año universitario!**

**PathFinder GI** es una app web gratuita para estudiantes de primer año que centraliza todo lo que necesitas en la universidad: Todo para aprender de tu instituto, cursos, ranking con tus compañeros y eventos importantes. Rápida, segura y actualizada. ¡Instálala en tu celular y mantente al día, sin perderte nada!

[Ver la app en vivo](https://pathfinder-gi.vercel.app/)

## Características principales 🚀

- **Dashboard académico** personal con tu progreso de cursos y eventos.
- **Cursos y módulos interactivos** para explorar.
- **Ranking**: compara tu avance con otros estudiantes.
- **Eventos y puntos de interés:** te enteras de la vida universitaria automáticamente.
- **Autenticación segura con Google** (Firebase).
- **Notificaciones push** para que no te pierdas nada importante.
- **PWA**: Puedes instalarla como app móvil.

¿Eres tutor o administrador? Accede a tu panel personalizado para gestionar estudiantes, módulos y mucho más.

## ¿Cómo empezar?

1. Ingresa aquí: [Link a la app online](https://pathfinder-gi.vercel.app/).
2. Regístrate con tu correo institucional.
3. Explora tu dashboard, cursos y puntos de interés.  
4. Prueba la instalación en tu dispositivo ("Agregar a pantalla de inicio").

---

## Para desarrolladores

### Tecnologías principales

- **Next.js 15 / App Router** con React 19, Server & Client Components, Turbopack.
- **Firebase**: Authentication, Firestore, Storage y Firebase Admin SDK para rutas API protegidas.
- **next-pwa** para capacidades offline/instalación, `lucide-react` para iconografía y `recharts` para analíticas.
- **TypeScript** y CSS Modules para tipado y estilos aislados.

### Estructura de carpetas

app/ # Rutas App Router (landing, auth, main, admin, api/*)  
components/ # UI reutilizable organizada por dominio (commons, dashboard, courses…)  
contexts/ # Contextos globales (AuthProvider)  
hooks/ # Hooks client-side (notificaciones, instalación PWA)  
libs/ # Configuración Firebase, rutas, tipos y utilidades de seguridad  
public/ # Manifest, SW y recursos estáticos  
scripts/ # Herramientas (p.ej. seed de módulos)  
styles/ # Foundations, helpers y tipografías globales  

### Configuración

1. Crea el archivo `.env.local` con las claves públicas de Firebase:
    env
    NEXT_PUBLIC_FIREBASE_API_KEY=...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=...

1. Variables privadas (Firebase Admin) deben residir en `.env.local` o un gestor seguro:
    env
    FIREBASE_PROJECT_ID=...
    FIREBASE_CLIENT_EMAIL=...
    FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

1. Instala dependencias: `npm install`.

### Ejecución

| Contexto          | Comando          | Descripción                                                                               |
|-------------------|------------------|-------------------------------------------------------------------------------------------|
| Desarrollo        | `npm run dev`    | Serve con Turbopack, SW deshabilitado para depurar más rápido.                            |
| Build             | `npm run build`  | Genera la versión optimizada, manifiesto y service worker.                                |
| Producción local  | `npm start`      | Levanta la build previa para probar PWA, instalación e integración Firebase.              |

### Arquitectura y flujo

1. `app/layout.tsx` aplica estilos globales, `ThemeProvider` y `AuthProvider` (contexto que escucha `onAuthStateChanged` y obtiene datos del usuario desde Firestore).
1. Secciones privadas viven bajo `/app/main/*`. Cada página cliente obtiene un `idToken` y consulta las rutas API (`/app/api/**`) protegidas por Firebase Admin.
1. El middleware (`middleware.ts`) lee la cookie `auth` para enrutar estudiantes, tutores y administradores.
1. Las rutas API funcionan como BFF, por ejemplo:
    - `/api/user/profile` retorna perfil enriquecido desde Firestore.
    - `/api/modules/progress` consolida progreso de lecciones.
    - `/api/admin/dashboard` agrega usuarios, módulos y eventos para la vista administrativa.
1. La capa de datos usa colecciones Firestore (`users`, `modules`, `events`, `pointsOfInterest`) y subcolecciones (`lessonProgress`, `notifications`, `userAchievements`).
