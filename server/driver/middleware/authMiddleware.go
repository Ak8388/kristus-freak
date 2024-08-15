package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/model"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/util/common"
)

type AuthMiddleware interface {
	JwtVerified(role ...string) gin.HandlerFunc
}

type authMiddleware struct {
	auth common.JwtUtil
}

// JwtVerified implements AuthMiddleware.
func (auth *authMiddleware) JwtVerified(role ...string) gin.HandlerFunc {

	return func(ctx *gin.Context) {
		var tokenPayload model.TokenModel

		rest := ctx.Request.Header.Get("Authorization")
		tokenString := strings.Replace(rest,"Bearer " ,"",-1)
		tokenPayload = model.TokenModel{
			TokenAccess: tokenString,
		}

		claim, err := auth.auth.VerifiedToken(tokenPayload)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusForbidden,gin.H{"message" :err.Error()})
			return 
		}
		expired :=  claim["exp"].(float64)
		if time.Now().After(time.Unix(int64(expired), 10)) {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"message": "Unauthorizated"})
			return
		}

		var roleValidate = false
			for _,i := range role {
			if claim["Role"].(string) == i {
				roleValidate = true
				
			}

		}

		if !roleValidate{
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"message" :"Unauthorized"})
			return
		}
		ctx.Set("ROLE",claim["Role"].(string))
		ctx.Set("Email",claim["Email"].(string))
		ctx.Set("Id",claim["Id"].(float64))
		ctx.Next()

	}
	
}

func NewAuthMiddleware(auth common.JwtUtil) AuthMiddleware {
	return &authMiddleware{auth}
}
