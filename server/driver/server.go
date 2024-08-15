package driver

import (
	// "fmt"
	// "net/http"

	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/company_profile/config"
	"github.com/kriserohalia/company_profile/driver/controller"
	"github.com/kriserohalia/company_profile/driver/middleware"
	"github.com/kriserohalia/company_profile/manager"
	"github.com/kriserohalia/company_profile/util/common"
)

type serverRequirement struct {
	cfg *config.Config
	engine *gin.Engine
	port string
	usecasemanager manager.UsecaseManager
	jwtutil common.JwtUtil
	// address string
}

func (sr *serverRequirement) SetUpServer(){
	rg := sr.engine.Group("api-putra-jaya")
	am := middleware.NewAuthMiddleware(sr.jwtutil)
	controller.NewAuthController(am,sr.usecasemanager.AuthUsecaseManager(),rg).AuthRouter()
	controller.NewUserController(am,sr.usecasemanager.UserUsecaseManager(),rg).UserRouter()
	controller.NewCategoryController(am,sr.usecasemanager.CategoryUsecaseManager(),rg).CategoryRouter()
	controller.NewProductController(am, sr.usecasemanager.ProductUsecaseManager(),rg).ProductRouter()
	controller.NewDetailController(am, sr.usecasemanager.DetailUsecaseManager(),rg).DetailRouter()
	controller.NewCustomController(am,sr.usecasemanager.CustomUsecaseManager(),rg).CustomRouter()
	controller.NewTransactionController(am,sr.usecasemanager.TransactionManager(),rg).TransactionRouter()
	controller.NewCompanyController(am, sr.usecasemanager.CompanyManager(),rg).CompanyRouter()
	controller.NewServiceController(am,sr.usecasemanager.ServiceManager(),rg).ServiceRouter()
}

func(sr *serverRequirement) Run(){

	sr.SetUpServer()
	if err := sr.engine.Run(":"+sr.port);err != nil {
		panic(err)
	}

	// fmt.Printf("Server listening on %s", sr.address)
    // if err := http.ListenAndServe(sr.address, nil); err != nil {
    // 	fmt.Printf("Server failed to start: %v", err)
    // }

}

func NewServer() *serverRequirement{

	eng := gin.Default()
	cfg := config.Cfg()
	infra := manager.NewInfraManager(cfg)
	repo := manager.NewRepoManager(infra)
	jwtutil := common.NewJwtUtil(cfg)
	uc := manager.NewUsecaseManager(repo,jwtutil)
	middleware.CORSMiddleware(eng)


	return &serverRequirement{
		cfg:            cfg,
		engine:         eng,
		port:           cfg.APIPort,
		usecasemanager: uc,
		jwtutil:        jwtutil,
		// address: "8081",
	}
}