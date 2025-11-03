import { profile } from "console";

export const ROUTES = {
    home: '/',
    login: '/auth/login',
    register: '/auth/register',
    userhome: '/main/dashboard',
    courses: '/main/courses',
    explore: '/main/explore',
    pathbot: '/main/pathbot',
    ranking: '/main/ranking',
    profile: '/main/profile',
    details: {
        event: (id: string) => `/main/details/event/${id}`,
        place: (id: string) => `/main/details/place/${id}`,
    },
};