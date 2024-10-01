FROM golang:1.23 AS builder

WORKDIR /app

COPY . /app

RUN CGO_ENABLED=0 go build -o backend .

FROM ubuntu:24.10 

WORKDIR /app

COPY --from=builder /app/backend /app/backend

CMD ["/app/backend"]
