FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npx tsc

EXPOSE 5000

CMD ["node", "dist/server.js"]
