ARG NODE_IMAGE=node:16-alpine
# ARG NODE_IMAGE=node:lts-alpine
ARG NGINX_IMAGE=nginx:1.16.0-alpine
# ARG NGINX_IMAGE=nginx:alpine

FROM ${NODE_IMAGE} AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force

FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ENV VITE_APP_API_URL=https://api.digitefa.id/api
# ENV VITE_IMAGE_API=https://api.digitefa.id/api
# ENV VITE_APP_API_URL=https://api.tefa.my.id/api
# ENV VITE_IMAGE_API=https://api.tefa.my.id
ENV VITE_APP_API_URL=http://localhost:3000/api
ENV VITE_IMAGE_API=http://localhost:3000
RUN npm run build

FROM ${NGINX_IMAGE}
ENV JSFOLDER=/usr/share/nginx/html/static/js/*.js
ENV TZ=Asia/Jakarta
WORKDIR /usr/share/nginx/html

RUN rm -rf ./*

COPY --from=builder /app/dist .
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80 443

# CMD [ "nginx -g 'daemon off;'" ]
CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
# ENTRYPOINT [ "sh","/usr/bin/run.sh" ]
