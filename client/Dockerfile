# Build files
FROM node:latest AS builder
WORKDIR /app
COPY package*.json ./

RUN npm install
COPY . .
RUN npm run build

# Nginx web server
FROM nginx:latest
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY --from=builder /app/dist .
CMD ["nginx", "-g", "daemon off;"]
