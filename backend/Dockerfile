FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

# El comando se pasa desde docker-compose.yml
# CMD ["npm", "run", "dev"]