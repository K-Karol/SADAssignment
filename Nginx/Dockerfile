FROM nginx

EXPOSE 80

# COPY ["nginx/karol.crt", "/etc/ssl/certs/karol.crt"]
# COPY ["nginx/karol.key", "/etc/ssl/private/karol.key"]
COPY ["nginx.conf", "/etc/nginx/nginx.conf"]

CMD ["nginx", "-g", "daemon off;"]