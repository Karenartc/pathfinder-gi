import type { User, Course, Event, Place, CourseDetail, LessonDetail, Notification  } from "@/libs/types";

/* ────────────────────────────────────────────────
USUARIO ACTUAL
──────────────────────────────────────────────── */
export async function getUser(): Promise<User> {
    return {
        id: "u6",
        name: "Usuario prueba",
        career: "Ingeniería Informática",
        careerCount: 10,
        points: 228,
        globalRank: 26,
        email: "user@prueba.com",
        avatarUrl: "/images/fox-avatar.png",
        preferences: {
            darkMode: false,
            notificationsEnabled: true,
        },
    };
}

/* ────────────────────────────────────────────────
RANKING GLOBAL / POR CARRERA
──────────────────────────────────────────────── */
export async function getRankingGlobal(): Promise<User[]> {
    return [
            { id: "u1", name: "Francisca Soza", career: "Diseño Gráfico", points: 995, globalRank: 1, careerCount: 1, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u2", name: "Leonardo Ceas", career: "Ingeniería Informática", points: 609, globalRank: 2, careerCount: 1, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u3", name: "Javiera Cortez", career: "Diseño Gráfico", points: 584, globalRank: 3, careerCount: 2, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u4", name: "María Contreras", career: "Ingeniería Automatización", points: 464, globalRank: 4, careerCount: 1, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u5", name: "Lois Becket", career: "Ingeniería Informática", points: 436, globalRank: 5, careerCount: 2, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u7", name: "Andrés Morales", career: "Ingeniería Informática", points: 422, globalRank: 6, careerCount: 3, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u8", name: "Valentina Pérez", career: "Diseño Gráfico", points: 410, globalRank: 7, careerCount: 3, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u9", name: "Sofía Ramírez", career: "Ingeniería Informática", points: 392, globalRank: 8, careerCount: 4, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u10", name: "Ignacio Herrera", career: "Ingeniería Automatización", points: 379, globalRank: 9, careerCount: 2, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u11", name: "Carolina Díaz", career: "Ingeniería Informática", points: 368, globalRank: 10, careerCount: 5, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u12", name: "Felipe González", career: "Diseño Gráfico", points: 359, globalRank: 11, careerCount: 4, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u13", name: "Daniel Pizarro", career: "Ingeniería Informática", points: 345, globalRank: 12, careerCount: 6, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u14", name: "Camila Torres", career: "Administración de Empresas", points: 336, globalRank: 13, careerCount: 1, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u15", name: "Sebastián Vega", career: "Ingeniería Informática", points: 330, globalRank: 14, careerCount: 7, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u16", name: "Martina López", career: "Diseño Gráfico", points: 326, globalRank: 15, careerCount: 5, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u17", name: "Tomás Espinoza", career: "Ingeniería Informática", points: 312, globalRank: 16, careerCount: 8, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u18", name: "Paula Navarro", career: "Ingeniería Automatización", points: 301, globalRank: 17, careerCount: 3, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u19", name: "Matías Rojas", career: "Ingeniería Informática", points: 290, globalRank: 18, careerCount: 9, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u20", name: "Isidora Campos", career: "Diseño Gráfico", points: 284, globalRank: 19, careerCount: 6, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u21", name: "Ricardo Silva", career: "Ingeniería Informática", points: 273, globalRank: 20, careerCount: 10, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u22", name: "Constanza Leiva", career: "Administración de Empresas", points: 262, globalRank: 21, careerCount: 2, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u23", name: "Felipe Soto", career: "Ingeniería Informática", points: 254, globalRank: 22, careerCount: 11, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u24", name: "María José Herrera", career: "Diseño Gráfico", points: 249, globalRank: 23, careerCount: 7, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u25", name: "Gabriel Castro", career: "Ingeniería Informática", points: 239, globalRank: 24, careerCount: 12, avatarUrl: "/images/PathFox-estudiante.png" },

            // --- Usuario actual: bajado al puesto 26 global y 10° en Informática ---
            { id: "u6", name: "Usuario prueba", career: "Ingeniería Informática", points: 228, globalRank: 26, careerCount: 10, avatarUrl: "/images/fox-avatar.png" },

            { id: "u26", name: "Lucía Fuentes", career: "Ingeniería Automatización", points: 221, globalRank: 27, careerCount: 4, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u27", name: "Cristóbal Muñoz", career: "Ingeniería Informática", points: 214, globalRank: 28, careerCount: 13, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u28", name: "Josefa Arancibia", career: "Diseño Gráfico", points: 207, globalRank: 29, careerCount: 8, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u29", name: "Pablo Valdés", career: "Ingeniería Informática", points: 199, globalRank: 30, careerCount: 14, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u30", name: "Antonia Reyes", career: "Administración de Empresas", points: 191, globalRank: 31, careerCount: 3, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u31", name: "Renato Vidal", career: "Ingeniería Informática", points: 185, globalRank: 32, careerCount: 15, avatarUrl: "/images/PathFox-Camino.png" },
            { id: "u32", name: "Camilo Bravo", career: "Ingeniería Informática", points: 176, globalRank: 33, careerCount: 16, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u33", name: "Julieta Morales", career: "Diseño Gráfico", points: 168, globalRank: 34, careerCount: 9, avatarUrl: "/images/PathFox-estudiante.png" },
            { id: "u34", name: "Benjamín Ortiz", career: "Ingeniería Informática", points: 156, globalRank: 35, careerCount: 17, avatarUrl: "/images/PathFox-Premio.png" },
            { id: "u35", name: "Carla Peña", career: "Ingeniería Automatización", points: 149, globalRank: 36, careerCount: 5, avatarUrl: "/images/PathFox-PoleraRoja.png" },
            { id: "u36", name: "Francisco Jara", career: "Ingeniería Informática", points: 138, globalRank: 37, careerCount: 18, avatarUrl: "/images/PathFox-Camino.png" },
    ];
}

export async function getRankingByCareer(career: string): Promise<User[]> {
    const all = await getRankingGlobal();
    return all
        .filter((u) => u.career === career)
        .sort((a, b) => b.points - a.points)
        .map((u, i) => ({ ...u, globalRank: i + 1 }));
}

/* ────────────────────────────────────────────────
MÓDULOS / CURSOS
──────────────────────────────────────────────── */
export async function getCourses(): Promise<Course[]> {
    return [
        {
        id: "c1",
        title: "Bienvenida",
        progress: 100,
        imageUrl: "/images/PathFox-estudiante.png", 
        },
        {
        id: "c2",
        title: "Mi carrera",
        progress: 90,
        imageUrl: "/images/PathFox-estudiante.png",
        },
        {
        id: "c3",
        title: "Mi sede",
        progress: 48,
        imageUrl: "/images/PathFox-mapa.png",
        },
        {
        id: "c4",
        title: "Mi DAE",
        progress: 0,
        imageUrl: "/images/PathFox-PoleraRoja.png",
        },
        {
        id: "c5",
        title: "Mi Prueba",
        progress: 0,
        imageUrl: "/images/PathFox-Camino.png",
        },
    ];
}

/* ────────────────────────────────────────────────
EVENTOS PRÓXIMOS
──────────────────────────────────────────────── */
export async function getEvents(): Promise<Event[]> {
    return [
        {
        id: "e1",
        title: "Comienzo de Clases Otoño",
        place: "Sede, Patio de atrás",
        dateISO: "2026-03-12",
        imageUrl: "/images/Bienevidos-Event.jpeg",
        description: "Inicio del semestre con actividades de bienvenida y orientación para alumnos nuevos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        isActive: true,  
      },
        {
        id: "e2",
        title: "Bienvenida de alumnos nuevos",
        place: "Sede, Biblioteca",
        dateISO: "2026-03-11",
        imageUrl: "/images/biblioteca-lugar.jpeg",
        description: "Encuentro organizado por DAE para dar la bienvenida a los estudiantes de primer año. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        isActive: true,
      },
    ];
}

/* ────────────────────────────────────────────────
DETALLE DE EVENTO (buscar por ID)
──────────────────────────────────────────────── */
export async function getEventById(id: string): Promise<Event | undefined> {
    const events = await getEvents();
    return events.find((e) => e.id === id);
}

/* ────────────────────────────────────────────────
LUGARES
──────────────────────────────────────────────── */
export async function getPlaces(): Promise<Place[]> {
    return [
        {
        id: "p1",
        name: "Biblioteca Central",
        description:
            "Espacio de estudio y recursos académicos. Ideal para investigación y trabajo colaborativo.",
        image: "/images/biblioteca-lugar.jpeg",
        location: "Primer piso",
        building: "Edificio A",
        room: "A-101",
        hours: "Lunes a Viernes, 09:00 a 21:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p1"
        },
        {
        id: "p2",
        name: "Centro DAE",
        description:
            "Oficina del Departamento de Asuntos Estudiantiles. Aquí puedes informarte sobre becas y actividades.",
        image: "/images/dae-lugar.jpeg",
        location: "Segundo piso, Edificio Central",
        building: "Edificio B",
        room: "B-204",
        hours: "Lunes a Viernes, 10:00 a 18:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p2"
        },
        {
        id: "p3",
        name: "Casino",
        description:
            "Comedor principal del campus. Ofrece menú diario, snacks y bebidas.",
        image: "/images/casino-lugar.jpeg",
        location: "Primer piso, junto al patio central",
        building: "Edificio C",
        hours: "Lunes a Viernes, 08:00 a 17:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p3"
        },
        {
        id: "p4",
        name: "Biblioteca Central",
        description:
            "Espacio de estudio y recursos académicos. Ideal para investigación y trabajo colaborativo.",
        image: "/images/biblioteca-lugar.jpeg",
        location: "Primer piso",
        building: "Edificio A",
        room: "A-101",
        hours: "Lunes a Viernes, 09:00 a 21:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p1"
        },
        {
        id: "p5",
        name: "Centro DAE",
        description:
            "Oficina del Departamento de Asuntos Estudiantiles. Aquí puedes informarte sobre becas y actividades.",
        image: "/images/dae-lugar.jpeg",
        location: "Segundo piso, Edificio Central",
        building: "Edificio B",
        room: "B-204",
        hours: "Lunes a Viernes, 10:00 a 18:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p2"
        },
        {
        id: "p6",
        name: "Casino",
        description:
            "Comedor principal del campus. Ofrece menú diario, snacks y bebidas.",
        image: "/images/casino-lugar.jpeg",
        location: "Primer piso, junto al patio central",
        building: "Edificio C",
        hours: "Lunes a Viernes, 08:00 a 17:00",
        qrCodeUrl: "https://pathfinder-app.com/qr/p3"
        }
    ];
}


/* ────────────────────────────────────────────────
DETALLE DEL LUGAR (buscar por ID)
──────────────────────────────────────────────── */
export async function getPlaceById(id: string): Promise<Place | undefined> {
    const places = await getPlaces();
    return places.find((p) => p.id === id);
}


/* ────────────────────────────────────────────────
NOTIFICACIONES (mock local)
──────────────────────────────────────────────── */
export async function getNotifications(): Promise<Notification[]> {
    return [
        {
        id: "n1",
        message: "Has completado la lección 2 de 'Mi sede'",
        type: "lesson",
        dateISO: "2025-11-04T09:00:00Z",
        read: false,
        },
        {
        id: "n2",
        message: "Nuevo evento: Feria de Bienvenida",
        type: "event",
        dateISO: "2025-11-03T16:00:00Z",
        read: false,
        link: "/main/details/event/e1", 
        },
        {
        id: "n3",
        message: "Escaneaste el QR del Centro DAE",
        type: "qr",
        dateISO: "2025-11-02T12:00:00Z",
        read: false,
        },
        {
        id: "n4",
        message: "Has completado la lección 2 de 'Mi sede'",
        type: "lesson",
        dateISO: "2025-11-04T09:00:00Z",
        read: false,
        },
        {
        id: "n5",
        message: "Nuevo evento: Feria de Bienvenida",
        type: "event",
        dateISO: "2025-11-03T16:00:00Z",
        read: false,
        link: "/main/details/event/e1", 
        },
        {
        id: "n6",
        message: "Escaneaste el QR del Centro DAE",
        type: "qr",
        dateISO: "2025-11-02T12:00:00Z",
        read: false,
        },
        {
        id: "n7",
        message: "Has completado la lección 2 de 'Mi sede'",
        type: "lesson",
        dateISO: "2025-11-04T09:00:00Z",
        read: false,
        },
        {
        id: "n8",
        message: "Nuevo evento: Feria de Bienvenida",
        type: "event",
        dateISO: "2025-11-03T16:00:00Z",
        read: false,
        link: "/main/details/event/e1", 
        },
        {
        id: "n9",
        message: "Escaneaste el QR del Centro DAE",
        type: "qr",
        dateISO: "2025-11-02T12:00:00Z",
        read: false,
        },
        {
        id: "n10",
        message: "Has completado la lección 2 de 'Mi sede'",
        type: "lesson",
        dateISO: "2025-11-04T09:00:00Z",
        read: true,
        },
        {
        id: "n11",
        message: "Nuevo evento: Feria de Bienvenida",
        type: "event",
        dateISO: "2025-11-03T16:00:00Z",
        read: false,
        link: "/main/details/event/e1", 
        },
        {
        id: "n12",
        message: "Escaneaste el QR del Centro DAE",
        type: "qr",
        dateISO: "2025-11-02T12:00:00Z",
        read: false,
        },
    ];
}

/* ────────────────────────────────────────────────
LOGROS / ACHIEVEMENTS
──────────────────────────────────────────────── */
import type { Achievement } from "@/libs/types";

export async function getAchievements(): Promise<Achievement[]> {
    return [
        {
        id: "a1",
        name: "Comienzo de clases 2026",
        description: "Asististe al evento en Sede, Patio de atrás el 12 de Marzo.",
        pointsAwarded: 30,
        iconUrl: "/images/achievements/class-start.png",
        dateUnlocked: "2026-03-12",
        },
        {
        id: "a2",
        name: "Curso Mi Carrera Completo",
        description: "Completaste todos los Módulos del curso Mi Carrera.",
        pointsAwarded: 25,
        iconUrl: "/images/achievements/course-complete.png",
        dateUnlocked: "2026-03-10",
        },
        {
        id: "a3",
        name: "La Biblioteca",
        description: "Desbloqueaste La Biblioteca en el Mapa Explorador.",
        pointsAwarded: 20,
        iconUrl: "/images/achievements/library.png",
        dateUnlocked: "2026-03-05",
        },
        {
        id: "a4",
        name: "Comenzar la Aventura",
        description: "Ingresaste por primera vez a PathFinder GI.",
        pointsAwarded: 10,
        iconUrl: "/images/achievements/start.png",
        dateUnlocked: "2026-03-01",
        },
        {
        id: "a5",
        name: "Curso Mi Carrera Completo",
        description: "Completaste todos los Módulos del curso Mi Carrera.",
        pointsAwarded: 25,
        iconUrl: "/images/achievements/course-complete.png",
        dateUnlocked: "2026-03-10",
        },
        {
        id: "a6",
        name: "La Biblioteca",
        description: "Desbloqueaste La Biblioteca en el Mapa Explorador.",
        pointsAwarded: 20,
        iconUrl: "/images/achievements/library.png",
        dateUnlocked: "2026-03-05",
        },
        {
        id: "a7",
        name: "Comenzar la Aventura",
        description: "Ingresaste por primera vez a PathFinder GI.",
        pointsAwarded: 10,
        iconUrl: "/images/achievements/start.png",
        dateUnlocked: "2026-03-01",
        },
    ];
}
/* ────────────────────────────────────────────────
Mock data para los cursos
──────────────────────────────────────────────── */
export async function getCoursesDetail(): Promise<CourseDetail[]> {
    return [
        {
        id: "c1",
        title: "Bienvenida",
        progress: 100,
        image: "/images/PathFox-estudiante.png", 
        lessons: [
            { id: "01", title: "¿Dónde estamos?", description: "texto", completed: true },
            { id: "02", title: "¿Qué hacemos?", description: "Texto", completed: true },
            { id: "03", title: "¿QPor qué lo hacemos?", description: "Texto.", completed: true },
        ],
        },
        {
        id: "c2",
        title: "Mi carrera",
        progress: 90,
        image: "/images/PathFox-estudiante.png", 
        lessons: [
            { id: "l1", title: "¿Qué ramas tiene la Ingeniería Informática?", description: "Especialidades, campo y futuro.", completed: true },
            { id: "l2", title: "¿Qué se espera de mí en esta disciplina?", description: "Rol, competencias y mentalidad clave.", completed: true },
            { id: "l3", title: "¿Qué materias tendré este semestre?", description: "Plan de estudios actual.", completed: true },
            { id: "l4", title: "¿Qué herramientas y lenguajes aprenderé?", description: "Primeros pasos en la programación.", completed: true },
            { id: "l5", title: "¿Quiénes son mis jefes de carrera y coordinadores?", description: "Líderes académicos y contactos clave.", completed: true },
            { id: "l6", title: "¿Qué laboratorios debo conocer en el campus?", description: "Espacios físicos para la práctica.", completed: false },
        ],
        },
        {
        id: "c3",
        title: "Mi sede",
        image: "/images/PathFox-mapa.png",
        progress: 48,
        lessons: [
            { id: "l1", title: "¿Dónde están los principales servicios estudiantiles?", description: "DAE, biblioteca, laboratorios, etc.", completed: true },
            { id: "l2", title: "¿Cómo puedo reservar salas?", description: "Sistema de reservas y normas de uso.", completed: false },
        ],
        },
        {
        id: "c4",
        title: "Mi DAE",
        progress: 0,
        image: "/images/PathFox-PoleraRoja.png",
        lessons: [
            { id: "l1", title: "¿Qué servicios ofrece el DAE?", description: "Acompañamiento, becas, bienestar.", completed: false },
        ],
        },
        {
        id: "c5",
        title: "Mi Prueba",
        progress: 0,
        image: "/images/PathFox-Camino.png",
        lessons: [
            { id: "l1", title: "¿Cómo hacer las pruebas?", description: "Texto", completed: false },
        ],
        },
    ];
}

export async function getCourseById(id: string): Promise<CourseDetail | undefined> {
    const courses = await getCoursesDetail();
    return courses.find((c) => c.id === id);
}

/* ────────────────────────────────────────────────
DETALLES DE LECCIONES (contenido completo)
──────────────────────────────────────────────── */
export async function getLessonDetails(): Promise<LessonDetail[]> {
  return [
    /* ───────────── Curso: Bienvenida ───────────── */
    {
      id: "01",
      courseId: "c1",
      title: "¿Dónde estamos?",
      subtitle: "Conoce tu entorno académico y campus.",
      image: "/images/PathFox-estudiante.png",
      content: [
        "Tu primer paso en la vida universitaria comienza con conocer tu sede: sus espacios, servicios y personas clave.",
        "Aquí descubrirás dónde se ubican los laboratorios, biblioteca, DAE y otros lugares fundamentales.",
      ],
    },
    {
      id: "02",
      courseId: "c1",
      title: "¿Qué hacemos?",
      subtitle: "Explora los objetivos de tu formación.",
      image: "/images/PathFox-Camino.png",
      content: [
        "En tu carrera desarrollarás habilidades prácticas y teóricas que te prepararán para los desafíos del mundo laboral.",
        "Cada módulo te permitirá avanzar en tu ruta personalizada dentro de PathFinder.",
      ],
    },
    {
      id: "03",
      courseId: "c1",
      title: "¿Por qué lo hacemos?",
      subtitle: "El propósito de tu formación profesional.",
      image: "/images/PathFox-Premio.png",
      content: [
        "Porque creemos que cada estudiante merece una experiencia significativa en su proceso educativo.",
        "Tu desarrollo personal, técnico y humano es el centro de nuestro propósito.",
      ],
    },

    /* ───────────── Curso: Mi carrera ───────────── */
    {
      id: "l1",
      courseId: "c2",
      title: "¿Qué ramas tiene la Ingeniería Informática?",
      subtitle: "Especialidades, campo y futuro.",
      image: "/images/PathFox-estudiante.png",
      content: [
        "La Ingeniería Informática abarca desde el desarrollo de software hasta la ciberseguridad y la inteligencia artificial.",
        "Cada rama te permitirá aplicar la tecnología para resolver problemas reales de la sociedad.",
      ],
    },
    {
      id: "l2",
      courseId: "c2",
      title: "¿Qué se espera de mí en esta disciplina?",
      subtitle: "Rol, competencias y mentalidad clave.",
      image: "/images/PathFox-Camino.png",
      content: [
        "Se espera que desarrolles pensamiento lógico, creatividad, capacidad analítica y compromiso con la innovación.",
        "Tu mentalidad curiosa y tu capacidad para resolver problemas serán tu mayor fortaleza.",
      ],
    },
    {
      id: "l3",
      courseId: "c2",
      title: "¿Qué materias tendré este semestre?",
      subtitle: "Plan de estudios actual.",
      image: "/images/PathFox-PoleraRoja.png",
      content: [
        "Durante el primer semestre cursarás asignaturas base como Programación, Matemáticas, Comunicación Efectiva y Tecnología de la Información.",
        "Estas materias te darán las herramientas necesarias para avanzar con solidez en tu formación.",
      ],
    },
    {
      id: "l4",
      courseId: "c2",
      title: "¿Qué herramientas y lenguajes aprenderé?",
      subtitle: "Primeros pasos en la programación.",
      image: "/images/PathFox-Camino.png",
      content: [
        "Aprenderás lenguajes como Python y JavaScript, junto con herramientas de desarrollo colaborativo como Git y Visual Studio Code.",
        "Estas bases te prepararán para crear tus propios proyectos e innovar en el ámbito tecnológico.",
      ],
    },
    {
      id: "l5",
      courseId: "c2",
      title: "¿Quiénes son mis jefes de carrera y coordinadores?",
      subtitle: "Líderes académicos y contactos clave.",
      image: "/images/PathFox-Premio.png",
      content: [
        "Tus jefes de carrera y coordinadores están para acompañarte en tu trayectoria académica.",
        "Puedes acudir a ellos para resolver dudas curriculares o para orientación vocacional y profesional.",
      ],
    },
    {
      id: "l6",
      courseId: "c2",
      title: "¿Qué laboratorios debo conocer en el campus?",
      subtitle: "Espacios físicos para la práctica.",
      image: "/images/PathFox-estudiante.png",
      content: [
        "Los laboratorios son espacios diseñados para que practiques lo aprendido en tus asignaturas técnicas.",
        "Asegúrate de localizar el Laboratorio de Redes y el Centro de Innovación Tecnológica.",
        "Al escanear sus códigos QR dentro de la app, podrás desbloquear módulos y sumar puntos en tu ranking.",
      ],
      questions: [
      {
        id: "q1",
        question: "¿Dónde puedes practicar lo aprendido en tus clases técnicas?",
        options: [
          "En la cafetería de la sede",
          "En los laboratorios del campus",
          "En el DAE",
        ],
        correctIndex: 1,
      },
      {
        id: "q2",
        question: "¿Qué laboratorio se menciona en la lección?",
        options: [
          "Laboratorio de Seguridad",
          "Laboratorio de Redes",
          "Laboratorio de Electrónica",
        ],
        correctIndex: 1,
      },
    ],
  },

    /* ───────────── Curso: Mi sede ───────────── */
    {
      id: "l1",
      courseId: "c3",
      title: "¿Dónde están los principales servicios estudiantiles?",
      subtitle: "DAE, biblioteca, laboratorios, etc.",
      image: "/images/PathFox-mapa.png",
      content: [
        "Tu sede cuenta con múltiples espacios diseñados para apoyarte: biblioteca, laboratorios, DAE, cafetería y más.",
        "Puedes usar el mapa interactivo de PathFinder para encontrarlos fácilmente.",
      ],
    },
    {
      id: "l2",
      courseId: "c3",
      title: "¿Cómo puedo reservar salas?",
      subtitle: "Sistema de reservas y normas de uso.",
      image: "/images/PathFox-PoleraRoja.png",
      content: [
        "Puedes reservar salas a través del portal estudiantil o en la recepción de la sede.",
        "Recuerda respetar los horarios y cuidar los espacios compartidos.",
      ],
    },

    /* ───────────── Curso: Mi DAE ───────────── */
    {
      id: "l1",
      courseId: "c4",
      title: "¿Qué servicios ofrece el DAE?",
      subtitle: "Acompañamiento, becas, bienestar.",
      image: "/images/PathFox-Camino.png",
      content: [
        "El DAE te apoya con orientación psicológica, becas, beneficios sociales y actividades extracurriculares.",
        "Visítalo para mantenerte informado y conectado con la comunidad estudiantil.",
      ],
    },

    /* ───────────── Curso: Mi Prueba ───────────── */
    {
      id: "l1",
      courseId: "c5",
      title: "¿Cómo hacer las pruebas?",
      subtitle: "Indicaciones básicas.",
      image: "/images/PathFox-Camino.png",
      content: [
        "En este módulo aprenderás cómo se realizan las evaluaciones y cómo preparar tus entregas en el sistema académico.",
      ],
    },
  ];
}

/* Buscar lección por curso y ID */
export async function getLessonById(courseId: string, lessonId: string): Promise<LessonDetail | undefined> {
  const lessons = await getLessonDetails();
  return lessons.find((l) => l.courseId === courseId && l.id === lessonId);
}

