package handler

import (
	"net/http"

	"github.com/gin-gonic/gin"

	"github.com/janithya-pr/weather-service/internal/service"
)

type CacheHandler struct {
	service *service.CacheService
}

func NewCacheHandler(s *service.CacheService) *CacheHandler {
	return &CacheHandler{service: s}
}

func (h *CacheHandler) GetStatus(c *gin.Context) {
	status, err := h.service.GetStatus(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error": err.Error(),
		})
		return
	}

	c.JSON(http.StatusOK, status)
}