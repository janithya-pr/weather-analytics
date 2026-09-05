package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janithya-pr/weather-service/internal/service"
)

type WeatherHandler struct {
	service *service.WeatherService
}

func NewWeatherHandler(s *service.WeatherService) *WeatherHandler {
	return &WeatherHandler{service: s}
}

func (h *WeatherHandler) GetWeather(c *gin.Context) {
	data, err := h.service.AllCityWeather(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusBadGateway, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, data)
}