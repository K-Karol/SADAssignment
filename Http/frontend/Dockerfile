# stage1 as builder
FROM node:18.7.0-alpine as builder

WORKDIR /app

# Copy the package.json and install dependencies
COPY package*.json .
RUN npm install

# Copy rest of the files
COPY . .

CMD ["npm", "start"]