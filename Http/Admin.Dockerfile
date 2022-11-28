# stage1 as builder
FROM node:18.7.0-alpine as builder

WORKDIR /src/frontend

# Copy the package.json and install dependencies
COPY frontend/package*.json .
RUN npm install

# Copy rest of the files
COPY frontend/. .

# Build the project
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:6.0 AS msbuild

WORKDIR /src/blazorAdminPanel

COPY BlazorAdminPanel/BlazorAdminPanel.csproj .
RUN dotnet restore BlazorAdminPanel.csproj
COPY BlazorAdminPanel/ .
RUN dotnet build BlazorAdminPanel.csproj -c Release -o /app/build

FROM msbuild as mspublish
RUN dotnet publish BlazorAdminPanel.csproj -c Release -o /app/publish

FROM nginx

COPY ["nginx-selfsigned.crt", "/etc/nginx/certs/nginx-selfsigned.crt"]
COPY ["nginx-selfsigned.key", "/etc/nginx/certs/nginx-selfsigned.key"]
COPY ["nginx.admin.conf", "/etc/nginx/nginx.conf"]
COPY ["htpasswd", "/etc/nginx/conf/htpasswd"]
RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /src/frontend/build /usr/share/nginx/html
COPY --from=mspublish /app/publish/wwwroot/admin /usr/share/nginx/html/admin

CMD ["nginx", "-g", "daemon off;"]