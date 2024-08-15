package middleware

import (
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func CORSMiddleware(eng *gin.Engine) {
 crs:= cors.Config{
	AllowOrigins: []string{"*"},
	AllowMethods: []string{"GET", "POST","PUT","DELETE", "OPTIONS"},
	AllowHeaders:     []string{"Origin", "Content-Type", "Accept", "Authorization"},
	AllowCredentials:true,
 }

 eng.Use(cors.New(crs))

}