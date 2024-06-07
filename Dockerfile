    FROM nginx:alpine 
    WORKDIR /var/www/web
    COPY build .
    COPY nginx.conf /etc/nginx/nginx.conf
    EXPOSE 80
