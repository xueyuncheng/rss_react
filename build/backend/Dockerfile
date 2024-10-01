FROM golang:1.23 AS builder

WORKDIR /app

COPY . .

RUN CGO_ENABLED=0 go build -o backend ./cmd/backend/*.go

FROM ubuntu:24.10 

WORKDIR /app

COPY --from=builder /app/backend ./backend

COPY ./config/backend.yaml ./backend

CMD ["/app/backend", "-f", "/app/backend.yaml"]
