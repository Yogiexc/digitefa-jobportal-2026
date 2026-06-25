FROM nginx:1.16.0-alpine
ENV JSFOLDER=/usr/share/nginx/html/static/js/*.js
ENV TZ=Asia/Jakarta
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY ./dist .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
