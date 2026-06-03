FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY server.js ./
COPY public/ ./public/

# Railway injects PORT at runtime — don't hardcode it
EXPOSE 3000

CMD ["node", "server.js"]
