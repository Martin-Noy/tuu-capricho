# Usa una imagen base de Node.js
FROM node:18-alpine

# Define el directorio de trabajo
WORKDIR /usr/src/app

# Copia package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usará la app
EXPOSE 8000

# Comando para iniciar la aplicación (con hot-reloading para desarrollo)
CMD [ "npm", "run", "dev" ]
