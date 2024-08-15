package model

import "regexp"

type Login struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Register struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
	Role     string `json:"role"`
}

type ResponseLoginRepo struct {
	Id       int
	Email    string
	Password string
	Role     string
}

func (regis *Register) IsValidEmail() bool {
	// Regular expression untuk memvalidasi format email
	const emailRegexPattern = `^[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$`

	// Compile regular expression
	re := regexp.MustCompile(emailRegexPattern)

	// Cek apakah email sesuai dengan pola
	return re.MatchString(regis.Email)
}
