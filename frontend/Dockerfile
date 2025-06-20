# Dockerfile para el Frontend (React.js)
# Ubicar este archivo en la raíz de la carpeta 'frontend'

# Etapa 1: Construir la aplicación React
FROM node:18-alpine AS build

WORKDIR /app

# Copia los archivos de manifiesto de dependencias y los instala
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copia el resto del código del frontend
COPY . .

# Construye la aplicación React para producción
RUN npm run build

# Etapa 2: Servir la aplicación con Nginx
FROM nginx:alpine

# Copia la configuración de Nginx
# Asegúrate de crear este archivo en tu carpeta 'frontend/nginx/nginx.conf'
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos construidos de la aplicación React al directorio de Nginx
COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]