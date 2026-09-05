package models

// Processed domain model and Output DTO
type Weather struct {
	ID          int    `json:"id"`
	Name        string `json:"name"`
	Country     string `json:"country"`
	Description string `json:"description"`
	Icon        string `json:"icon"`

	Score int `json:"score"`
	Rank  int `json:"rank"`

	Temp      float64 `json:"temp"`
	Humidity  float64 `json:"humidity"`
	WindSpeed float64 `json:"wind_speed"`
	
	Comfort ComfortFactors `json:"comfort"`
}

type ComfortFactors struct {
	TemperatureScore float64 `json:"temperature_score"`
	HumidityScore    float64 `json:"humidity_score"`
	WindScore        float64 `json:"wind_score"`
}