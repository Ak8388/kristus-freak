package utilmodel

import "github.com/golang-jwt/jwt/v5"

type JwtModel struct {
	jwt.RegisteredClaims

	Id int 
	Email string
	Role string
}