# frontend/Dockerfile

# --- Etapa 1: Build ---
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Serve ---
# Usa una imagen de Nginx para servir los archivos estáticos generados
FROM nginx:stable-alpine

# Copiar los archivos estáticos desde la etapa de 'build' al directorio web de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Copiar la configuración personalizada de Nginx
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Comando para iniciar Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]