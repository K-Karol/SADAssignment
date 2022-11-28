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
FROM builder as dist-builder

#ENV NODE_ENV production

<<<<<<< HEAD
RUN npm run build
=======
run npm run build
>>>>>>> d03900a (changed the scripts and dockerfile to build backend during composing (build) and run the built files instead of nodemon so it is less taxing during frontend since debugging backend is not needed.)

CMD ["npm", "run", "start"]