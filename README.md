# Weather Analytics

A full-stack weather analytics application that retrieves weather data for multiple cities, calculates a custom **Comfort Index**, ranks cities based on comfort, and presents the results through a responsive web interface.

The application uses **Go** for the backend API, **React + TypeScript** for the frontend, **Redis** for server-side caching, and **Auth0** for API authentication.

## Tech Stack

### Backend
- **Go 1.26**
- **Gin** — HTTP web framework
- **Redis** — Server-side caching
- **OpenWeatherMap API** — Weather data provider
- **Auth0** — JWT authentication
- **Docker & Docker Compose** — Containerization
- **Go testing** — Unit testing

### Frontend
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Auth0 React SDK**

### Infrastructure & Tools
- **Docker**
- **Docker Compose**
- **Redis**
- **Git & GitHub**

---

# Getting Started

## 1. Environment Variables

Create the required environment configuration.

### Backend

Create a `.env` file for the backend:

```env
PORT=

AUTH0_DOMAIN=
AUTH0_AUDIENCE=

OPENWEATHER_BASE_URL=
OPENWEATHER_API_KEY=

REDIS_PASSWORD=
CACHE_TTL_SECONDS=
```

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_AUTH0_DOMAIN=
VITE_AUTH0_CLIENT_ID=
VITE_AUTH0_AUDIENCE=
VITE_API_BASE_URL=
```

---

# Running the Project

## Option 1 — Run Backend with Docker

Docker Compose runs the backend together with its Redis dependency.

```bash
# Clone the repository
git clone <YOUR_REPOSITORY_URL>

# Navigate to the project
cd weather-analytics

# Create and configure the .env files

# Build and start the application
docker compose up --build
```

To stop the containers:

```bash
docker compose down
```

### Prerequisites

- Docker
- Docker Compose

---

## Option 2 — Run Backend Without Docker

If Docker is not used for the backend, **Redis must be installed and running locally**.

```bash
cd backend

go mod download

go run ./cmd/api/
```

---

## Frontend

The frontend currently runs directly with Node.js rather than inside Docker.

```bash
cd frontend

npm install

npm run dev
```

The Vite development server will display the local frontend URL in the terminal.

### Prerequisites

- Node.js
- npm

---

# Running Unit Tests

The Comfort Index calculation has unit tests covering the scoring logic.

From the `backend` directory:

```bash
go test -v ./internal/weather/
```

To run all backend tests:

```bash
go test ./...
```

---

# API Documentation

## Get Weather Data

```http
GET /api/v1/weather
```
Returns weather information for all configured cities.

```http
Authorization: Bearer <access_token>
```
The endpoint requires a valid Auth0 access token.

### Example Response

```json
[
  {
    "id": 2147714,
    "name": "Sydney",
    "country": "AU",
    "description": "overcast clouds",
    "icon": "04n",
    "score": 68,
    "rank": 1,
    "temp": 21.64,
    "humidity": 60,
    "wind_speed": 6.69,
    "comfort": {
      "temperature_score": 96,
      "humidity_score": 63,
      "wind_score": 6
    }
  },
  {
    "id": 5128581,
    "name": "New York",
    "country": "US",
    "description": "overcast clouds",
    "icon": "04n",
    "score": 64,
    "rank": 2,
    "temp": 23.39,
    "humidity": 61,
    "wind_speed": 5.81,
    "comfort": {
      "temperature_score": 83,
      "humidity_score": 60,
      "wind_score": 24
    }
  }
]
```

---

# Cache Status

```http
GET /api/v1/cache/status
```

Returns information about the current Redis cache state.

### Example Response

```json
{
  "processed_weather": "MISS",
  "raw_weather": {
    "hits": 0,
    "misses": 15
  }
}
```

---

# Project Structure

```text
weather-analytics/
├── weather-service/
│   ├── cmd/
│   │   └── api/
│   ├── internal/
│   ├── cities.json
│   ├── .env
│   ├── go.mod
│   ├── go.sum
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── .env
│   ├── package.json
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md
```

---

# API Endpoints

| Method | Endpoint | Authentication | Description |
|---|---|---|---|
| `GET` | `/api/v1/weather` | Required | Returns processed and ranked weather data |
| `GET` | `/api/v1/cache/status` | No | Returns Redis cache status |

---

# Processing Flow

The weather endpoint follows a cache-first processing strategy to minimize external API requests and improve response time.

```text
Client
  │
  │ GET /api/v1/weather
  ▼
Go API
  │
  ▼
Check Processed Weather Cache
  │
  ├── HIT ──────────────────────────► Return Cached Data
  │
  └── MISS
       │
       ├── City 1
       │    │
       │  Fetch OpenWeatherMap
       │  Store Raw Weather Data
       │    │
       │    ▼
       │  Process Weather Data
       │    │
       │    ├── Calculate Temperature Score
       │    ├── Calculate Humidity Score
       │    ├── Calculate Wind Score
       │    └── Calculate Comfort Score
       │
       ├── City n
       │     └── ...
       │
       ▼
    Sort Cities
    Assign Rankings
    Store Processed Data
       │
       ▼
    Return Data
```

## Cache Strategy

The application therefore uses two different cache levels:

| Cache | Data | Store |
|---|---|---|
| **Processed Weather Cache** | Complete processed, sorted and ranked dataset | One by one city |
| **Raw Weather Cache** | Raw weather response for each city | All city at once |

---

# Comfort Index Calculation

The application calculates a **Comfort Index Score from 0–100** for each city using three weather factors.

The general formula is:

```text
Penalty = min(|value − ideal value| / tolerance, 1)
```

It's questioning - **How far is the current weather condition from ideal?**

Weights of three weather factors:

- **Temperature** — 50% of the final score
- **Humidity** — 30% of the final score
- **Wind Speed** — 20% of the final score

A score closer to **100** represents more comfortable weather conditions, while a score closer to **0** represents less comfortable conditions.

### 1. Temperature Score

The OpenWeatherMap API provides temperature in **Kelvin**, so it is first converted to Celsius:

```text
Temperature (°C) = Temperature (K) − 273.15
```

The application considers **22°C** to be the ideal temperature.

The further the temperature moves away from 22°C, the larger the penalty becomes.

```text
Temperature Penalty =
    min(|Temperature − 22| / 8, 1)

Temperature Score =
    1 − Temperature Penalty
```

For example:

```text
22°C  → Score: 100
18°C  → Score: 50
14°C  → Score: 0
30°C  → Score: 0
```

Temperature contributes **50%** to the final Comfort Index.

---

### 2. Humidity Score

The application considers **45% relative humidity** to be the ideal level.

The further the humidity moves away from 45%, the larger the penalty becomes.

```text
Humidity Penalty =
    min(|Humidity − 45| / 40, 1)

Humidity Score =
    1 − Humidity Penalty
```

For example:

```text
45%  → Score: 100
25%  → Score: 50
5%   → Score: 0
85%  → Score: 0
```

Humidity contributes **30%** to the final Comfort Index.

---

### 3. Wind Speed Score

For wind speed, the application considers wind speeds up to **2 m/s** to have no penalty.

Wind speeds above 2 m/s gradually reduce the score.

```text
Wind Penalty =
    min(max(Wind Speed − 2, 0) / 5, 1)

Wind Score =
    1 − Wind Penalty
```

This means:

```text
0–2 m/s  → Score: 100
3 m/s    → Score: 80
4 m/s    → Score: 60
5 m/s    → Score: 40
7 m/s+   → Score: 0
```

Wind contributes **20%** to the final Comfort Index.

---

## Formula Summary

Finally, the individual scores are combined using their weights:

```text
Final Comfort Score =
    (Temperature Score × 0.50)
  + (Humidity Score × 0.30)
  + (Wind Score × 0.20)
```

This approach makes the calculation easy to understand and adjust: **the ideal value defines the most comfortable condition, while the tolerance defines how quickly the score decreases as the weather moves away from that condition.**