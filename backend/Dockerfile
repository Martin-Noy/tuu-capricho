# Usa una imagen base de Node.js (por ejemplo, la 18-alpine)
FROM node:18-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Instala dependencias para pdfkit (requiere cairo, etc.)
# Esto asegura que las librerías necesarias estén disponibles en el contenedor
RUN apk add --no-cache python3 make g++ cairo-dev jpeg-dev pango-dev giflib-dev

# Copia los archivos de manifiesto de dependencias y los instala
COPY package.json ./
COPY package-lock.json ./
RUN npm install --omit=dev

# Copia el resto del código de la aplicación
COPY . .

# Expone el puerto que usa tu aplicación backend
EXPOSE 3001

# Comando para iniciar la aplicación
CMD ["npm", "start"]