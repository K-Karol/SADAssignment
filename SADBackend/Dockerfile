# Common build stage
FROM node:16 as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# Development build stage
FROM builder as dev-builder

#ENV NODE_ENV development

CMD ["npm", "run", "dev"]

# Production build stage
FROM builder as prod-builder

#ENV NODE_ENV production

run npm run build

CMD ["npm", "run", "start"]