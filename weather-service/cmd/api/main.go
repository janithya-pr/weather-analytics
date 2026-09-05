package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"

	"github.com/janithya-pr/weather-service/internal/auth"
	"github.com/janithya-pr/weather-service/internal/cache"
	"github.com/janithya-pr/weather-service/internal/config"
	"github.com/janithya-pr/weather-service/internal/handler"
	"github.com/janithya-pr/weather-service/internal/service"
)

func main() {
	cfg := config.LoadConfig()

	// Extract citys from the JSON
	cities, err := config.LoadCities(cfg.CitiesFilePath)
	if err != nil {
		log.Fatalf("Failed to initialize cities list: %v", err)
	}
	log.Printf("loaded %d cities", len(cities))

	// Safa time out
	redisCtx, redisCancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer redisCancel()

	// Readis client once
	redisClient, err := cache.New(redisCtx, cfg.RedisAddr, cfg.RedisPassword)
	if err != nil {
		log.Fatalf("failed to initialize Redis: %v", err)
	}
	defer redisClient.Close()

	log.Println("Redis connected successfully")

	httpClient := &http.Client{
		Timeout: 10 * time.Second,
	}

	weatherSvc := service.NewWeatherService(
		httpClient,
		cfg.OpenWeatherBaseURL,
		cfg.OpenWeatherAPIKey,
		cities,
		redisClient,
		cfg.CacheTTLSeconds,
	)

	cacheSvc := service.NewCacheService(
		redisClient,
		cities,
	)

	weatherHandler := handler.NewWeatherHandler(weatherSvc)
	cacheHandler := handler.NewCacheHandler(cacheSvc)

	// Middleware initialize once
    authMiddleware, err := auth.New(cfg.Auth0Domain, cfg.Auth0Audience)
    if err != nil {
        log.Fatalf("auth setup failed: %v", err)
    }

	router := gin.Default()

	router.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
	}))

	api := router.Group("/api/v1")
	{
		api.GET("/weather", authMiddleware.Handler(), weatherHandler.GetWeather)
		api.GET("/cache/status", cacheHandler.GetStatus)
	}

	log.Printf("Starting Weather Analytics Service on port %s...", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatalf("Server startup failed: %v", err)
	}
}