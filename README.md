# 🏔️ Proyecto "Excursiones Juntos"

Este repositorio contiene la aplicación completa "Excursiones Juntos", que consta de un frontend desarrollado en React y un backend en Node.js con Express.

## 📂 Estructura del Proyecto

- **/excursiones**: Contiene el código fuente de la aplicación frontend (cliente React).
- **/testserver**: Contiene el código fuente de la API del backend (servidor Node.js).

## 🚀 Puesta en Marcha con Docker (Recomendado)

Con Docker Compose, puedes levantar tanto el frontend como el backend con un solo comando.

### ✅ Requisitos Previos

- Instala [Docker](https://www.docker.com/products/docker-desktop/) en tu sistema.

### ⚙️ Pasos

1.  **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd excursiones-juntos
    ```

2.  **Configura las variables de entorno del backend:**
    Crea el archivo `.env` para el servidor a partir del ejemplo proporcionado.

    ```bash
    cp testserver/.env.example testserver/.env
    ```

    Abre `testserver/.env` y rellena los valores necesarios (como `JWT_SECRET`).

3.  **Levanta la aplicación:**
    Desde el directorio raíz (`excursiones-juntos`), ejecuta el siguiente comando:
    ```bash
    docker-compose up --build
    ```

Una vez finalizado, podrás acceder a:

- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:3001`

Para detener la aplicación, presiona `Ctrl + C` en la terminal donde se está ejecutando `docker-compose`.
