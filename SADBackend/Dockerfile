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

# Development build stage
FROM builder as test-builder

#ENV NODE_ENV development

CMD ["npm", "run", "test"]

# Production build stage
FROM builder as dist-builder

#ENV NODE_ENV production

RUN npm run build

CMD ["npm", "run", "start"]
