package models

// City parsing struct for cities.json
type City struct {
	CityCode string `json:"CityCode"`
	CityName string `json:"CityName"`
}

type CitiesFile struct {
	List []City `json:"List"`
}