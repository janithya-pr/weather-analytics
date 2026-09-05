package config

import (
	"encoding/json"
	"fmt"
	"os"

	"github.com/janithya-pr/weather-service/internal/models"
)

func LoadCities(filePath string) ([]models.City, error) {
	file, err := os.Open(filePath)
	if err != nil {
		return nil, fmt.Errorf("unable to open cities file: %w", err)
	}
	defer file.Close()

	var citiesData models.CitiesFile
	if err := json.NewDecoder(file).Decode(&citiesData); err != nil {
		return nil, fmt.Errorf("unable to parse cities.json: %w", err)
	}

	if len(citiesData.List) < 10 {
		return nil, fmt.Errorf(
			"cities.json must contain at least 10 cities, found: %d",
			len(citiesData.List),
		)
	}

	return citiesData.List, nil
}