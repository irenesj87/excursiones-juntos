# ⚙️ Servidor de prueba para "Excursiones Juntos"

Este proyecto es un servidor backend simple construido con Node.js y Express. Proporciona una API REST para gestionar datos de excursiones y usuarios, incluyendo funcionalidades de autenticación, búsqueda y filtrado.

## ✨ Características Principales

- **Gestión de Excursiones**: Obtiene una lista completa de excursiones.
- **Búsqueda y Filtrado**: Permite buscar excursiones por nombre y aplicar filtros dinámicos por área, dificultad y tiempo.
- **Autenticación de Usuarios**: Endpoints para registro, login y validación de tokens JWT.
- **Gestión de Usuarios**: Permite a los usuarios unirse a excursiones y actualizar su perfil.
- **Base de Datos en Memoria**: Utiliza arrays de JavaScript para simular una base de datos, ideal para desarrollo y pruebas sin configuración adicional.

## 🛠️ Tecnologías Utilizadas

- **Node.js**: Entorno de ejecución de JavaScript del lado del servidor.
- **Express**: Framework minimalista para construir la API REST.
- **JSON Web Token (`jsonwebtoken`)**: Para la creación y validación de tokens de autenticación.
- **CORS**: Middleware para habilitar el Cross-Origin Resource Sharing y permitir peticiones desde el frontend.
- **Docker**: Para la contenerización de la aplicación, garantizando un entorno de ejecución consistente y portátil.

## 🚀 Puesta en Marcha con Docker (Recomendado)

Con Docker, puedes levantar el servidor con un par de comandos, sin necesidad de instalar Node.js o dependencias manualmente en tu sistema.

1.  **Requisitos Previos**: Instala Docker.
2.  Clona el repositorio y navega al directorio `testserver`.
3.  **Configura las variables de entorno.** Crea una copia del archivo `.env.example` y renómbrala a `.env`. Rellena los valores necesarios.
    ```bash
    cp .env.example .env
    ```
4.  Construye la imagen de Docker y ejecuta el contenedor.
    ```bash
    docker build -t excursiones-juntos-server .
    docker run -p 3001:3001 --env-file .env excursiones-juntos-server
    ```

El servidor estará escuchando en `http://localhost:3001`.

---

## 🏃 Puesta en Marcha (Manual)

### ✅ Requisitos Previos

- **Node.js (v16 o superior):** Es el entorno de ejecución para JavaScript. `npm` (Node Package Manager) se instala automáticamente con Node.js.

  - **Recomendado:** Descarga el instalador "LTS" desde la página oficial de Node.js.

- **Git:** Es el sistema de control de versiones utilizado para clonar los repositorios.

  - **Recomendado:** Descárgalo desde la página oficial de Git.

- **Nodemon (Opcional pero recomendado):** Herramienta que reinicia el servidor automáticamente al detectar cambios en los archivos, agilizando el desarrollo.
  ```bash
  npm install -g nodemon
  ```

Una vez instalados, puedes verificar que todo está correcto abriendo una terminal y ejecutando los siguientes comandos. Deberían mostrarte sus respectivas versiones:

```bash
node -v
npm -v
git --version
nodemon -v
```

### Instalación y Ejecución

1.  Clona el repositorio o descarga el código fuente.

    ```bash
    git clone https://github.com/tu-usuario/testserver.git
    ```

2.  Navega al directorio `testserver` en tu terminal.

    ```bash
    cd testserver
    ```

3.  **Configura las variables de entorno.** Crea una copia del archivo `.env.example` y renómbrala a `.env`.

    ```bash
    cp .env.example .env
    ```

    Abre el archivo `.env` y rellena los valores necesarios (como `JWT_SECRET`).

4.  Instala las dependencias del proyecto.

    ```bash
    npm install
    ```

5.  Inicia el servidor.
    ```bash
    npm start
    ```

El servidor estará escuchando en `http://localhost:3001`.

## 🔑 Configuración de Entorno

Este proyecto utiliza un archivo `.env` para gestionar las variables de entorno. Estas variables son esenciales para la seguridad y configuración de la aplicación.

- `JWT_SECRET`: Una cadena de texto larga y aleatoria utilizada para firmar y verificar los JSON Web Tokens. Es **crítico** para la seguridad de la autenticación.
- `CORS_ALLOWED_ORIGINS`: Una lista de URLs (separadas por comas) desde las cuales se permitirán peticiones a la API. Por ejemplo: `http://localhost:3000,https://mi-frontend.com`.

## 🔌 Endpoints Principales

- `POST /users`: Registra un nuevo usuario.
- `POST /login`: Inicia sesión y retorna un token.
- `GET /token/verify`: Valida un token existente (ruta protegida).
- `DELETE /logout`: Cierra la sesión del usuario (ruta protegida).
- `GET /excursions`: Retorna todas las excursiones. Permite filtrar por `q` (nombre), `area`, `difficulty` y `time`.
- `GET /filters?type={filterType}`: Obtiene los valores únicos para un tipo de filtro (`area`, `difficulty`, `time`).
- `PUT /users/:mail`: Actualiza la información del perfil de un usuario (ruta protegida).
- `GET /users/:mail/excursions`: Obtiene las excursiones a las que un usuario se ha apuntado (ruta protegida).
- `POST /users/:mail/excursions`: Permite a un usuario apuntarse a una excursión (ruta protegida).
