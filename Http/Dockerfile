# stage1 as builder
FROM node:18.7.0-alpine as builder

WORKDIR /src/vuespa

# Copy the package.json and install dependencies
COPY VueSPA/package*.json .
RUN npm install

# Copy rest of the files
COPY VueSPA/. .

# Build the project
RUN npm run build

FROM nginx

# COPY ["nginx/karol.crt", "/etc/ssl/certs/karol.crt"]
# COPY ["nginx/karol.key", "/etc/ssl/private/karol.key"]
COPY ["nginx.conf", "/etc/nginx/nginx.conf"]
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /src/vuespa/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]