/* ────────────────────────────────────────────────
Usuario (student / logged user / ranking)
──────────────────────────────────────────────── */
export type User = {
    id: string;
    name: string;              
    careerCount: number;      
    points: number;            
    globalRank: number;        
    career?: string;          
    email?: string;         
    avatarUrl?: string;  
    preferences?: {
        darkMode: boolean;           // true = modo oscuro
        notificationsEnabled: boolean; // true = recibir notificaciones push   
    };
};

/* ────────────────────────────────────────────────
Curso / Módulo (
──────────────────────────────────────────────── */
export type Course = {
    id: string;
    title: string;
    progress: number; // 0..100
    imageUrl: string;    // Imagen ilustrativa del módulo
};

/* ────────────────────────────────────────────────
Logro / Achievement
──────────────────────────────────────────────── */
export type Achievement = {
    id: string;
    name: string;
    description: string;
    pointsAwarded: number;
    iconUrl: string;
    dateUnlocked?: string;  
};

export type Place = {
    id: string;
    name: string;
    description: string;
    image: string;
    location?: string;
    hours?: string;
    building?: string;
    room?: string;
    qrCodeUrl?: string;
};

/* ────────────────────────────────────────────────
Notificación
──────────────────────────────────────────────── */
export type Notification = {
    id: string;
    message: string;       
    type: "lesson" | "event" | "qr" | "system"; 
    dateISO: string;          
    read: boolean;   
    link?: string;             
};

export type CourseLesson = {
    id: string;
    title: string;         // Ej: "¿Qué ramas tiene la Ingeniería Informática?"
    description: string;   // Ej: "Especialidades, campo y futuro."
    completed: boolean;
};

export type CourseDetail = {
    id: string;
    title: string;         // Ej: "Mi carrera"
    progress: number;      // 0–100
    image: string;
    lessons: CourseLesson[];
};

export type LessonQuestion = {
    id: string;
    question: string;
    options: string[];
    correctIndex: number;
};

export type LessonDetail = {
    id: string;
    courseId: string;
    title: string;
    subtitle?: string;
    image: string;
    content: string[];
    questions?: LessonQuestion[]; 
};

// libs/types.ts

export interface Module {
  id: string;
  name: string; // (antes "title")
  description?: string;
  imageUrl?: string;
  isActive: boolean;
  order: number;
  createdAt?: string;
}

export interface LessonProgress {
  id: string;
  moduleId: string;
  progress: number;
  updatedAt?: string;
}

export interface CourseWithProgress {
  id: string;
  title: string;
  image: string;
  progress: number;
  lessons: any[];
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  place?: string;
  dateISO: string;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  creatorId?: string;
}
