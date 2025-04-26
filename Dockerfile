FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expõe a porta 3000
EXPOSE 3000

# Start padrão (opcional, depende do seu entrypoint)
CMD ["node", "app.js"]
