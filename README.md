# 🏔️ Proyecto "Excursiones Juntos"

Aplicación web construida con React.js y Node.js que permite a los usuarios descubrir, buscar y apuntarse a excursiones. El proyecto está dividido en un frontend (excursiones) y una API RESTful (testserver).

## ✨ Características Principales

### Frontend (React.js)

- **Búsqueda y Filtrado Dinámico:** Busca excursiones por texto y filtra por zona, dificultad y duración.
- **Autenticación de Usuarios:** Sistema completo de registro, inicio de sesión y cierre de sesión con JWT.
- **Gestión de Perfil:** Los usuarios pueden ver y actualizar su información personal.
- **Optimización Automática:** Gracias a **React Compiler**, el código se optimiza automáticamente, eliminando la necesidad de memoización manual.
- **Interacción con Excursiones:** Los usuarios autenticados pueden apuntarse a las excursiones.

### Backend (Node.js)

- **API RESTful:** Endpoints bien definidos para gestionar usuarios, excursiones y autenticación.
- **Seguridad:**
  - Autenticación basada en **JSON Web Tokens (JWT)**.
  - Contraseñas hasheadas con `bcrypt`.
  - Configuración segura de **CORS** basada en una lista blanca (whitelist).
  - Variables de entorno seguras con `dotenv`.

## 🛠️ Tecnologías Utilizadas

| Área         | Tecnología                                                                            |
| :----------- | :------------------------------------------------------------------------------------ |
| **Frontend** | React (con React Compiler), TypeScript, React Router, Redux Toolkit, React Bootstrap. |
| **Backend**  | Node.js, Express, JWT, Bcrypt.                                                        |
| **DevOps**   | SonarQube.                                                                            |

## 📁 Estructura del Proyecto

El repositorio está organizado en dos directorios principales:

- `/excursiones`: Contiene la aplicación de frontend desarrollada con Create React App.
- `/testserver`: Contiene la API de backend desarrollada con Express.

## 🚀 Cómo Empezar

Sigue estos pasos para configurar y ejecutar el proyecto en tu máquina local.

### Prerrequisitos

- Node.js (versión 14 o superior)
- npm (generalmente se instala con Node.js)

### 1. Clonar el Repositorio

```bash
git clone https://github.com/irenesanjose/excursiones-juntos.git
cd excursiones-juntos
```

## Configurar y Ejecutar el Backend

Primero, necesitamos poner en marcha el servidor de la API.

### 1. Navega al directorio del servidor

```bash
cd testserver
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Crea y configura el archivo de variables de entorno `.env`

Copia el archivo `.env.example` a un nuevo archivo llamado `.env` dentro del mismo directorio.

```bash
cp .env.example .env
```

Luego, abre el archivo `.env` y modifica la variable `JWT_SECRET` con un valor seguro y único.

### 4. Inicia el servidor (se ejecutará en http://localhost:3001)

```bash
npm start
```

## Configurar y Ejecutar el Frontend

Ahora, en una **nueva terminal**, vamos a iniciar la aplicación de React.

### 1. Navega al directorio del frontend (desde la raíz del proyecto)

```bash
cd excursiones
```

### 2. Instala las dependencias

```bash
npm install
```

### 3. Inicia la aplicación de React (se abrirá en http://localhost:3000)

```bash
npm start
```
