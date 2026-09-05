package models

// OpenWeather Map API Response
type OpenWeatherResponse struct {
	ID         int                 `json:"id"`
	Name       string              `json:"name"`
	Weather    []WeatherCondition  `json:"weather"`
	Main       WeatherMain         `json:"main"`
	Visibility int                 `json:"visibility"`
	Wind       Wind                `json:"wind"`
	Clouds     Clouds              `json:"clouds"`
	Sys        WeatherSys          `json:"sys"`
}

type WeatherCondition struct {
	Main        string `json:"main"`
	Description string `json:"description"`
	Icon        string `json:"icon"`
}

type WeatherMain struct {
	Temp      float64 `json:"temp"`
	FeelsLike float64 `json:"feels_like"`
	TempMin   float64 `json:"temp_min"`
	TempMax   float64 `json:"temp_max"`
	Pressure  float64 `json:"pressure"`
	Humidity  float64 `json:"humidity"`
}

type Wind struct {
	Speed float64 `json:"speed"`
	Deg   float64 `json:"deg"`
}

type Clouds struct {
	All float64 `json:"all"`
}

type WeatherSys struct {
	Country string `json:"country"`
}