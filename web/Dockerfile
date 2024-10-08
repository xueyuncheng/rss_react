FROM node:22 AS builder 

WORKDIR /app

COPY package.json .

RUN npm install

COPY . /app

RUN npm run build

FROM caddy:2.8

COPY --from=builder /app/dist /usr/share/caddy

COPY --from=builder /app/Caddyfile /etc/caddy/Caddyfile

CMD [ "caddy", "run" ]
