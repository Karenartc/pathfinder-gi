import type { User, Course, Event, Place } from "@/libs/types";

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
        avatarUrl: "/images/fox-avatar.png",
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
        title: "Mi carrera",
        progress: 90,
        image: "/images/PathFox-estudiante.png",
        },
        {
        id: "c2",
        title: "Mi sede",
        progress: 48,
        image: "/images/PathFox-mapa.png",
        },
        {
        id: "c3",
        title: "Mi DAE",
        progress: 0,
        image: "/images/PathFox-PoleraRoja.png",
        },
        {
        id: "c4",
        title: "Mi Prueba",
        progress: 0,
        image: "/images/PathFox-Camino.png",
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
        image: "/images/Bienevidos-Event.jpeg",
        description: "Inicio del semestre con actividades de bienvenida y orientación para alumnos nuevos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
        },
        {
        id: "e2",
        title: "Bienvenida de alumnos nuevos",
        place: "Sede, Biblioteca",
        dateISO: "2026-03-11",
        image: "/images/biblioteca-lugar.jpeg",
        description: "Encuentro organizado por DAE para dar la bienvenida a los estudiantes de primer año. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos. Lorem ipsum dolor sit amet consectetur adipiscing elit. Quisque faucibus ex sapien vitae pellentesque sem placerat. In id cursus mi pretium tellus duis convallis. Tempus leo eu aenean sed diam urna tempor. Pulvinar vivamus fringilla lacus nec metus bibendum egestas. Iaculis massa nisl malesuada lacinia integer nunc posuere. Ut hendrerit semper vel class aptent taciti sociosqu. Ad litora torquent per conubia nostra inceptos himenaeos.",
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
