FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "node", "index.js" ]