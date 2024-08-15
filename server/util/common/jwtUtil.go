package common

import (
	"errors"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/kriserohalia/company_profile/config"
	"github.com/kriserohalia/company_profile/model"
	utilmodel "github.com/kriserohalia/company_profile/util/utilModel"
)

type JwtUtil interface {
	GenerateToken(Id int, Email, Role string)(model.TokenModel, error)

	VerifiedToken(model.TokenModel)(jwt.MapClaims, error)
}

type jwtUtil struct {
	config *config.Config
	
}

func ( jwtutil *jwtUtil) GenerateToken(Id int, Email, Role string)(model.TokenModel, error){
	var tokenmodel model.TokenModel


	claim := utilmodel.JwtModel{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    jwtutil.config.JWTConfig.IssuerName,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(jwtutil.config.JWTConfig.Expire)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Id:               Id,
		Email:            Email,
		Role:             Role,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256,claim)
	tokenString, err := token.SignedString([]byte(jwtutil.config.JWTConfig.SecretKey) )
	if err != nil {
		return model.TokenModel{},err
	}
	tokenmodel = model.TokenModel{TokenAccess: tokenString}
	return tokenmodel,nil
}


func ( jwtutil *jwtUtil) VerifiedToken(token model.TokenModel)(jwt.MapClaims, error){
	jwtParse, err:=  jwt.Parse(token.TokenAccess,func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.GetSigningMethod("HS256"){
			return nil,errors.New("failed to getting method token")
		}
		return []byte(jwtutil.config.JWTConfig.SecretKey), nil
	})
	if err !=nil {
		return jwt.MapClaims{},err
	}

	claims,ok := jwtParse.Claims.(jwt.MapClaims)
	if !jwtParse.Valid || !ok {
		return jwt.MapClaims{},errors.New("invalid token")
	}

	return claims,nil

}

func NewJwtUtil(cfg *config.Config) JwtUtil {
	return &jwtUtil{cfg}
}