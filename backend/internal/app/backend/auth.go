package backend

import (
	"backend/internal/pkg/jwt"

	"github.com/gin-gonic/gin"
)

func (b *Backend) auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		// get token from cookie
		token, err := c.Cookie("Token")
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": "Token cookie is required"})
			return
		}

		claims, err := jwt.ParseToken(token)
		if err != nil {
			c.AbortWithStatusJSON(401, gin.H{"error": err.Error()})
			return
		}

		c.Set("claims", claims)

		c.Next()
	}
}
