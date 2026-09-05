package weather

import (
	"math"

	"github.com/janithya-pr/weather-service/internal/models"
)

func CalculateComfortScore(tempK, humidity, windSpeed float64) (int, models.ComfortFactors) {
	tempC := tempK - 273.15

	// Temperature score
	tempPenalty := math.Min(math.Abs(tempC - 22.0) / 8.0, 1.0)
	tempScore := 1.0 - tempPenalty

	// Humidity score
	humidityPenalty := math.Min(math.Abs(humidity - 45.0) / 40.0, 1.0)
	humidityScore := 1.0 - humidityPenalty

	// Wind speed score
	windPenalty := math.Min(math.Max(0.0, windSpeed - 2.0) / 5.0, 1.0)
	windScore := 1.0 - windPenalty

	// Weighted score
	score := (tempScore*0.50 + humidityScore*0.30 + windScore*0.20) * 100

	return int(math.Round(score)), models.ComfortFactors{
		TemperatureScore: math.Round(tempScore * 100),
		HumidityScore:    math.Round(humidityScore * 100),
		WindScore:        math.Round(windScore * 100),
	}
}