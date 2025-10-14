# Usar una imagen base de Node.js ligera y segura
FROM node:18-alpine

# Por seguridad, crear un grupo y un usuario dedicados para la aplicación
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar los archivos de dependencias (package.json y package-lock.json)
COPY package*.json ./

# Instalar dependencias antes de cambiar de usuario para aprovechar el cache de Docker
# si solo cambia el código fuente.
# Instalar solo las dependencias de producción para mantener la imagen pequeña
RUN npm install --only=production

# Copiar el resto de los archivos de la aplicación (server.js, etc.)
# El .dockerignore se encarga de excluir archivos innecesarios.
COPY . .

# Cambiar el propietario de todos los archivos de la aplicación al usuario no-root.
RUN chown -R appuser:appgroup .

# Cambiar al usuario sin privilegios. Todos los comandos siguientes se ejecutarán como 'appuser'.
USER appuser

# Exponer el puerto en el que corre el servidor
EXPOSE 3001

# Comando para iniciar el servidor cuando el contenedor se ejecute
CMD [ "npm", "start" ]