FROM node:18-alpine AS runner

WORKDIR /app

COPY package.json ./
RUN npm install

COPY .next ./.next
COPY next.config.js ./
COPY public ./public

EXPOSE 3000

USER root

CMD ["npm", "run", "start"]
