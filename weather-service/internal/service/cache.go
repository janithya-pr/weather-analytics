package service

import (
	"context"

	"github.com/janithya-pr/weather-service/internal/cache"
	"github.com/janithya-pr/weather-service/internal/models"
)

type CacheService struct {
	cache  *cache.Client
	cities []models.City
}

func NewCacheService(
	cacheClient *cache.Client,
	cities []models.City,
) *CacheService {
	return &CacheService{
		cache:  cacheClient,
		cities: cities,
	}
}

type CacheStatus struct {
	ProcessedWeather string         `json:"processed_weather"`
	RawWeather       RawCacheStatus `json:"raw_weather"`
}

type RawCacheStatus struct {
	Hits   int `json:"hits"`
	Misses int `json:"misses"`
}

func (s *CacheService) GetStatus(ctx context.Context) (*CacheStatus, error) {

	// Check processed cache
	ttl, err := s.cache.TTL(ctx, "weather:processed")
	if err != nil {
		return nil, err
	}

	status := "MISS"

	if ttl > 0 {
		status = "HIT"
	}

	// Check raw cache for each city
	rawHits := 0
	rawMisses := 0

	for _, city := range s.cities {

		cacheKey := "weather:raw:" + city.CityCode
		ttl, err := s.cache.TTL(ctx, cacheKey)
		if err != nil {
			return nil, err
		}

		if ttl > 0 {
			rawHits++
		} else {
			rawMisses++
		}
	}

	return &CacheStatus{
		ProcessedWeather: status,
		RawWeather: RawCacheStatus{
			Hits:   rawHits,
			Misses: rawMisses,
		},
	}, nil
}