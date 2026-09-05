package service

import (
	"context"
	"encoding/json"
	"fmt"
	"math"
	"net/http"
	"sort"
	"sync"
	"time"

	
	"github.com/janithya-pr/weather-service/internal/cache"
	"github.com/janithya-pr/weather-service/internal/models"
	"github.com/janithya-pr/weather-service/internal/weather"
)

type WeatherService struct {
	client   *http.Client
	baseURL  string
	apiKey   string
	cities   []models.City
	cache    *cache.Client
	cacheTTL time.Duration
}

func NewWeatherService(
	client *http.Client,
	baseURL, apiKey string,
	cities []models.City,
	redisClient *cache.Client,
	cacheTTL time.Duration,
) *WeatherService {
	return &WeatherService{
		client:   client,
		baseURL:  baseURL,
		apiKey:   apiKey,
		cities:   cities,
		cache:    redisClient,
		cacheTTL: cacheTTL,
	}
}

func (s *WeatherService) FetchCityRaw(ctx context.Context, cityCode string) (*models.OpenWeatherResponse, error) {

	url := fmt.Sprintf("%s/weather?id=%s&appid=%s", s.baseURL, cityCode, s.apiKey)
	req, err := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
	if err != nil {
		return nil, err
	}

	resp, err := s.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("openweather API returned status: %d", resp.StatusCode)
	}

	var data models.OpenWeatherResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		return nil, err
	}

	// Store raw response in Redis for 5 minutes
	cacheKey := "weather:raw:" + cityCode
	if err := s.cache.Set(ctx, cacheKey, data, s.cacheTTL); err != nil {
		return nil, err
	}

	return &data, nil
}

func (s *WeatherService) CityWeather(ctx context.Context, cityCode string) (*models.Weather, error) {
	data, err := s.FetchCityRaw(ctx, cityCode)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch weather for city %s: %w", cityCode, err)
	}

	if len(data.Weather) == 0 {
		return nil, fmt.Errorf("weather condition not found for city %s", cityCode)
	}

	score, factors := weather.CalculateComfortScore(
		data.Main.Temp,
		data.Main.Humidity,
		data.Wind.Speed,
	)

	result := &models.Weather{
		ID:          data.ID,
		Name:        data.Name,
		Country:     data.Sys.Country,
		Description: data.Weather[0].Description,
		Icon:        data.Weather[0].Icon,
		Temp:        math.Round((data.Main.Temp-273.15)*100) / 100,
		Humidity:    math.Round(data.Main.Humidity*100) / 100,
		WindSpeed:   math.Round(data.Wind.Speed*100) / 100,
		Score:       score,
		Comfort:     factors,
	}

	return result, nil
}

func (s *WeatherService) AllCityWeather(ctx context.Context) ([]models.Weather, error) {
	// Check cache first
	var cached []models.Weather
	found, err := s.cache.Get(ctx, "weather:processed", &cached)
	if err != nil {
		return nil, fmt.Errorf("failed to read cache: %w", err)
	}

	if found {
		return cached, nil
	}

	// Fetch city weather and process
	numCities := len(s.cities)
	if numCities == 0 {
		return []models.Weather{}, nil
	}

	resChan := make(chan models.Weather, numCities)
	var wg sync.WaitGroup

	for _, city := range s.cities {
		wg.Add(1)
		go func(c models.City) {
			defer wg.Done()
			w, err := s.CityWeather(ctx, c.CityCode)
			if err != nil {
				return
			}
			resChan <- *w
		}(city)
	}

	wg.Wait()
	close(resChan)

	results := make([]models.Weather, 0, numCities)
	for w := range resChan {
		results = append(results, w)
	}

	if len(results) == 0 {
		return nil, fmt.Errorf("failed to retrieve any city")
	}

	// Rank and sort
	sort.Slice(results, func(i, j int) bool {
		return results[i].Score > results[j].Score
	})

	for i := range results {
		results[i].Rank = i + 1
	}

	// Cache processed weather
	if err := s.cache.Set(
		ctx,
		"weather:processed",
		results,
		s.cacheTTL,
		); err != nil {
		return nil, err
	}

	return results, nil
}