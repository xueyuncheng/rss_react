FROM node:22 AS builder 

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

RUN npm run build

FROM nginx:1.27

COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
