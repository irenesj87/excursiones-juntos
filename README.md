# 🏔️ Proyecto "Excursiones Juntos"

Una aplicación web construida con React y Node.js/Express que permite a los usuarios descubrir, buscar y apuntarse a excursiones. El proyecto está dividido en un frontend y una API RESTful.

## ✨ Características Principales

### Frontend (React)

- **Búsqueda y Filtrado Dinámico:** Busca excursiones por texto y filtra por zona, dificultad y duración.
- **Autenticación de Usuarios:** Sistema completo de registro, inicio de sesión y cierre de sesión con JWT.
- **Gestión de Perfil:** Los usuarios pueden ver y actualizar su información personal.
- **Interacción con Excursiones:** Los usuarios autenticados pueden apuntarse a las excursiones.

### Backend (Node.js/Express)

- **API RESTful:** Endpoints bien definidos para gestionar usuarios, excursiones y autenticación.
- **Seguridad:**
  - Autenticación basada en **JSON Web Tokens (JWT)**.
  - Contraseñas hasheadas con `bcrypt`.
  - **Rate Limiting** para prevenir ataques de fuerza bruta y abuso de la API.
  - Configuración segura de **CORS** basada en una lista blanca (whitelist).
  - Validación de entradas en todos los endpoints.
  - Variables de entorno seguras con `dotenv`.

## 🛠️ Tecnologías Utilizadas

| Área         | Tecnología                                                                                     |
| :----------- | :--------------------------------------------------------------------------------------------- |
| **Frontend** | React, React Router, Redux Toolkit, React Bootstrap, CSS Modules, Jest, React Testing Library. |
| **Backend**  | Node.js, Express, JWT, Bcrypt, Express-Rate-Limit, CORS.                                       |
| **DevOps**   | SonarQube (para análisis de código estático).                                                  |

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

```env
# Clave secreta para firmar los JSON Web Tokens (JWT)
JWT_SECRET=tu_clave_secreta_muy_larga_y_aleatoria_aqui

# Orígenes permitidos para las peticiones CORS (el puerto de tu app de React)
CORS_ALLOWED_ORIGINS=http://localhost:3000
```

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

## 🧪 Ejecutar Tests

- **Para el Frontend:** `cd excursiones && npm test`
- **Para el Backend:** Los tests para el backend aún no están implementados.
