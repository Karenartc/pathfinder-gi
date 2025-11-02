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
    avatarUrl?: string;       
    
};

/* ────────────────────────────────────────────────
Curso / Módulo (
──────────────────────────────────────────────── */
export type Course = {
    id: string;
    title: string;
    progress: number; // 0..100
    image: string;    // Imagen ilustrativa del módulo
};

/* ────────────────────────────────────────────────
Evento 
──────────────────────────────────────────────── */
export type Event = {
    id: string;
    title: string;
    place: string;      
    dateISO: string; 
    image: string;   
    description?: string; 
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
    category?: string;  // Ej: "Exploración", "Social", etc.
};
