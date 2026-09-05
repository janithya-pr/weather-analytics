package config

import (
	"os"
	"strconv"
	"time"
)

type Config struct {
	Port              string
	Auth0Domain       string
	Auth0Audience     string
	OpenWeatherBaseURL string
	OpenWeatherAPIKey  string
	RedisAddr         string
	RedisPassword     string
	CitiesFilePath    string
	// CacheTTLSeconds   int
	CacheTTLSeconds   time.Duration
}

func LoadConfig() *Config {
	return &Config{
		Port:               getEnv("PORT", "8080"),
		Auth0Domain:        getEnv("AUTH0_DOMAIN", "dev-6axm0kofekefwnwj.us.auth0.com"),
		Auth0Audience:      getEnv("AUTH0_AUDIENCE", "https://api.weather-analytics.com"),
		OpenWeatherBaseURL: getEnv("OPENWEATHER_BASE_URL", "https://api.openweathermap.org/data/2.5"),
		OpenWeatherAPIKey:  getEnv("OPENWEATHER_API_KEY", ""),
		RedisAddr:          getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:      getEnv("REDIS_PASSWORD", ""),
		CitiesFilePath:     getEnv("CITIES_FILE_PATH", "./cities.json"),
		CacheTTLSeconds:    getEnvAsSeconds("CACHE_TTL_SECONDS", 300*time.Second),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

// func getEnvAsInt(key string, fallback int) int {
// 	if valStr, ok := os.LookupEnv(key); ok {
// 		if val, err := strconv.Atoi(valStr); err == nil {
// 			return val
// 		}
// 	}
// 	return fallback
// }

func getEnvAsSeconds(key string, fallback time.Duration) time.Duration {
	if valStr, ok := os.LookupEnv(key); ok {
		if sec, err := strconv.Atoi(valStr); err == nil {
			return time.Duration(sec) * time.Second
		}
	}
	return fallback
}