FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

# El puerto 5173 es el default de Vite
EXPOSE 5173

# El comando se pasa desde docker-compose.yml
# CMD ["npm", "run", "dev"]