# Stage 1: Build
FROM golang:1.26-bookworm AS builder

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 \
    go build -trimpath -ldflags="-s -w -buildid=" \
    -o /out/server ./cmd/api


# Stage 2: Runtime
FROM gcr.io/distroless/static-debian12:nonroot

WORKDIR /app

COPY --from=builder /out/server /app/server
COPY --from=builder /app/cities.json /app/cities.json

EXPOSE 8080

ENTRYPOINT ["/app/server"]