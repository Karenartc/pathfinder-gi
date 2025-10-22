# PathFinder GI

Este es el proyecto frontend para **PathFinder GI**, construido con [Next.js](https://nextjs.org).

El proyecto está configurado como una **Progressive Web App (PWA)** usando `next-pwa` para permitir la instalación en dispositivos.

---

## 1. Instalación

Primero, clona el repositorio e instala todas las dependencias del proyecto:

```bash
npm install
````

---

## 2. Cómo correr el proyecto

Este proyecto tiene dos modos de ejecución.

### A. Modo de Desarrollo (Para codificar)

Usa este comando para el trabajo diario, construir componentes y ver cambios en vivo.

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

**IMPORTANTE:** En este modo, las funciones de PWA (como el service worker, el caché y el botón de "Instalar") están **deshabilitadas** a propósito para agilizar el desarrollo. No intentes probar la PWA en este modo.

### B. Modo de Producción Local (Para probar la PWA)

Para probar que la PWA funciona (ver el botón de "Instalar", probar el caché, etc.), **debes** seguir estos dos pasos:

**Paso 1: Compilar el proyecto**
Este comando genera la versión optimizada de producción y crea los archivos del service worker (`sw.js`).

```bash
npm run build
```

**Paso 2: Iniciar el servidor de producción**
Este comando corre la aplicación que acabas de compilar.

```bash
npm start
```

Ahora, abre [http://localhost:3000](http://localhost:3000).
