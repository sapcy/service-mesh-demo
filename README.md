# Service Mesh Demo Server

## Env Description
|                  | Type      | Description                   | Example                                  |
|------------------|-----------|-------------------------------|------------------------------------------|
| **VERSION**      | `String`  | Define version of this server | v1, v2, ... <br/>Default: v1             |
| **LOG**          | `Integer` | Log                           | 1                                        |
| **RANDOM_ERROR** | `Double`  | Define version of this server | 0.1, 0.2, ...<br/>0 <= RANDOM_ERROR <= 1 |

## Example

### Server side
```bash
export VERSION=v1
export LOG=1
export RANDOM_ERROR=0.1
npm start
> service-mesh-demo@1.0.0 start
> node server.js

[2024-05-28T05:13:48.236Z] SHOW ENV
[2024-05-28T05:13:48.239Z] * VERSION=v1
[2024-05-28T05:13:48.239Z] * RANDOM_ERROR=10%
[2024-05-28T05:13:48.239Z] * LOG=1
[2024-05-28T06:05:50.124Z] 200 Response - v1 : {"headers":{"host":"localhost:8080","user-agent":"curl/7.79.1","accept":"*/*"}}
[2024-05-28T06:05:36.699Z] 503 Response - v1 : {"headers":{"host":"localhost:8080","user-agent":"curl/7.79.1","accept":"*/*"}}
```

### Client side
```bash
# Normal
curl "http://localhost:8080"
200 Response - v1

# Random fault injection
curl "http://localhost:8080"
503 Response - v1 (random)

# Error
curl "http://localhost:8080/error"
503 Response - v1

# Delay
curl "http://localhost:8080?delay=3000"
200 Response - v1 (uri=/?delay=3000)
```

## Docker build
```bash
docker build -t service-mesh-demo:0.1.0 . --platform=linux/amd64
```