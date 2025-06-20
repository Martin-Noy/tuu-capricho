# Tuu Capricho - Agenda Virtual Personalizable

Este repositorio contiene el código para la aplicación web "Tuu Capricho", que permite a los usuarios personalizar agendas virtuales y adquirirlas en formato físico o digital.

---

## Estructura del Proyecto

El proyecto está dividido en dos partes principales:

1.  **`frontend/`**: Aplicación web construida con React.js.
2.  **`backend/`**: API RESTful construida con Node.js, Express.js y PostgreSQL.

---

## Requisitos Previos

* Node.js (versión 18 o superior)
* npm o Yarn
* PostgreSQL (base de datos)

---

## Configuración y Ejecución Local

### 1. Backend

1.  **Clona el repositorio:**
    ```bash
    git clone <URL_DE_TU_REPOSITORIO>
    cd tuu-capricho/backend
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o yarn add
    ```
3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `backend/` con las siguientes variables (ajusta los valores según tu configuración de PostgreSQL):
    ```env
    PORT=3001
    DB_USER=your_db_user
    DB_HOST=localhost
    DB_NAME=tuu_capricho_db
    DB_PASSWORD=your_db_password
    DB_PORT=5432
    ```
4.  **Configura la base de datos:**
    * Asegúrate de tener una instancia de PostgreSQL ejecutándose.
    * Crea una base de datos llamada `tuu_capricho_db` (o el nombre que hayas configurado en `.env`).
    * Ejecuta los comandos SQL para crear las tablas (`Secciones`, `Templates`, `Pedidos`, `DetallePedido`) que se proporcionaron en la guía del backend. Puedes usar `psql` o una herramienta GUI.
    * Crea las carpetas `uploads/covers` y `uploads/agendas` dentro de `backend/uploads` (o donde configures Multer para guardar los archivos).
    * Crea una carpeta `templates` dentro de `backend/templates` si tienes archivos PDF/imagen predefinidos para los templates.
5.  **Inicia el servidor backend:**
    ```bash
    npm start
    # o node src/app.js
    ```
    El servidor se ejecutará en `http://localhost:3001` (o el puerto que hayas configurado).

### 2. Frontend

1.  **Navega a la carpeta del frontend:**
    ```bash
    cd ../frontend
    ```
2.  **Instala las dependencias:**
    ```bash
    npm install
    # o yarn add
    ```
3.  **Configura las variables de entorno:**
    Crea un archivo `.env` en la raíz de la carpeta `frontend/` con la URL de tu backend:
    ```env
    REACT_APP_API_URL=http://localhost:3001/api
    ```
4.  **Inicia la aplicación React:**
    ```bash
    npm start
    ```
    La aplicación se abrirá en tu navegador en `http://localhost:3000` (o un puerto similar).

---

## Despliegue en Producción

### 1. Despliegue del Frontend (React) - Sugerencia: Vercel

Vercel es una excelente opción para desplegar aplicaciones React debido a su integración con Git y su facilidad de uso.

1.  **Crea una cuenta en Vercel** (si no la tienes).
2.  **Importa tu repositorio de Git** (GitHub, GitLab, Bitbucket).
3.  **Configura el proyecto:**
    * **Root Directory**: Asegúrate de que apunte a tu carpeta `frontend/` (por ejemplo, si tu repositorio raíz es `tuu-capricho`, establece el directorio raíz en `frontend`).
    * **Build Command**: `npm run build` o `yarn build`
    * **Output Directory**: `build`
    * **Environment Variables**: Añade `REACT_APP_API_URL` y establece su valor a la URL **pública** de tu backend desplegado (ej. `https://tuu-capricho-api.render.com/api`).
4.  **Despliega el proyecto.** Cada vez que hagas un `git push` a la rama configurada (ej. `main`), Vercel automáticamente hará un nuevo despliegue.

### 2. Despliegue del Backend (Node.js/Express) y Base de Datos (PostgreSQL) - Sugerencia: Render.com o Railway

Render.com y Railway son plataformas que facilitan el despliegue de aplicaciones Node.js y bases de datos PostgreSQL.

1.  **Crea una cuenta en Render.com o Railway.**
2.  **Conecta tu repositorio de Git.**
3.  **Crea un nuevo "Web Service" (para Node.js):**
    * **Root Directory**: Apunta a tu carpeta `backend/`.
    * **Build Command**: `npm install`
    * **Start Command**: `node src/app.js` (o `npm start` si lo has configurado en `package.json`)
    * **Environment Variables**:
        * `PORT` (generalmente Render lo asigna automáticamente, no es necesario definirlo aquí).
        * `DB_USER`, `DB_HOST`, `DB_NAME`, `DB_PASSWORD`, `DB_PORT` (estos serán los datos de conexión a tu base de datos PostgreSQL, que Render puede provisionar).
        * **¡Importante!** Asegúrate de que `DB_HOST` sea la URL interna de tu base de datos en Render, no `localhost`.
4.  **Crea un nuevo "PostgreSQL Database":**
    * Render te proporcionará los detalles de conexión (host, puerto, nombre de base de datos, usuario, contraseña). Usa estos para tus variables de entorno del Web Service.
    * Puedes usar un cliente de base de datos (como `DBeaver` o `pgAdmin`) para conectarte a la base de datos de Render y ejecutar los scripts de creación de tablas.
5.  **Consideraciones Adicionales:**
    * **Archivos Subidos (Carátulas, PDFs):** Para producción, no es ideal almacenar estos archivos directamente en el servidor de Render, ya que son efímeros y se perderían en cada despliegue. Considera usar un servicio de almacenamiento de objetos como **AWS S3, Google Cloud Storage o Cloudinary** para guardar las imágenes de carátula y los PDFs generados. Esto requerirá modificar tu lógica de `multer` y `pdfController` para subir y recuperar archivos de estos servicios.
    * **CORS:** Asegúrate de que tu configuración de `cors` en Express permita el dominio de tu frontend desplegado en Vercel.

---

## Seguridad Básica

* **Validación de Entrada:** Siempre valida los datos de entrada del usuario en el backend para prevenir ataques como inyección SQL o XSS. Usa librerías como `express-validator`.
* **Manejo de Errores:** Implementa un manejo de errores robusto para no exponer detalles sensibles de tu servidor a los usuarios.
* **Variables de Entorno:** Nunca hardcodees credenciales o claves API en tu código. Usa variables de entorno (como se muestra con `.env` y los servicios de despliegue).
* **HTTPS:** Los servicios de despliegue como Vercel y Render automáticamente configuran HTTPS, lo cual es crucial para la seguridad.

---