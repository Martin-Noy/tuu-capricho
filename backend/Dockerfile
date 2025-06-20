# Dockerfile para el Backend (Node.js/Express)
# Ubicar este archivo en la raíz de la carpeta 'backend'

FROM node:18-alpine

WORKDIR /app

# Instala dependencias para pdfkit (requiere cairo, etc.)
# Esto asegura que las librerías necesarias estén disponibles en el contenedor
RUN apk add --no-cache python3 make g++ libcairo-dev libjpeg-turbo-dev libpango1.0-dev libgif-dev

# Copia los archivos de manifiesto de dependencias y los instala
COPY package.json ./
COPY package-lock.json ./
RUN npm install --production

# Copia el resto del código del backend
COPY . .

# Crea los directorios de uploads si no existen (Multer los usará)
RUN mkdir -p uploads/covers uploads/agendas

# Expone el puerto que usa tu aplicación Node.js
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["node", "src/app.js"]