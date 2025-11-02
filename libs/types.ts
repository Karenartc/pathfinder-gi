export type User = {
    id: string;
    name: string;
    careerCount: number;
    points: number;
    globalRank: number;
};

export type Course = {
    id: string;
    title: string;
    progress: number; // 0..100
    image: string;
};

export type Event = {
    id: string;
    title: string;
    place: string;
    dateISO: string; // '2026-03-12'
    image: string;
};
