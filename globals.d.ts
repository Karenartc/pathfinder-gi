/*  Este archivo le dice a TypeScript que cualquier importación 
    que termine en .css es un "módulo" válido.
    Esto soluciona el error "Cannot find module" para los archivos CSS.
*/
declare module '*.css';
