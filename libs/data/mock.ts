import { User, Course, Event } from '../types';

export async function getUser(): Promise<User> {
    return { id: 'u_001', name: 'Usuario prueba', careerCount: 2, points: 789, globalRank: 5 };
}

export async function getCourses(): Promise<Course[]> {
    return [
        { id: 'c1', title: 'Mi carrera', progress: 90, image: '/images/PathFox-estudiante.png' },
        { id: 'c2', title: 'Mi sede',    progress: 48, image: '/images/PathFox-mapa.png' },
        { id: 'c3', title: 'Mi DAE',     progress:  0, image: '/images/PathFox-PoleraRoja.png' },
        { id: 'c4', title: 'Mi Prueba',     progress:  0, image: '/images/PathFox-Camino.png' },
    ];
}

export async function getEvents(): Promise<Event[]> {
    return [
        { id: 'e1', title: 'Comienzo de Clases Otoño', place: 'Sede, Patio de atrás', dateISO: '2026-03-12', image: '/images/Bienevidos-Event.jpeg' },
        { id: 'e2', title: 'Bienvenida de alumnos nuevos', place: 'Sede, Biblioteca', dateISO: '2026-03-11', image: '/images/biblioteca-lugar.jpeg' },
    ];
}
