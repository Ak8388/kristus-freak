package driver

import (
	"github.com/gin-gonic/gin"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/config"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/controller"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/driver/middleware"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/manager"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/util/common"
)

type serverRequirement struct {
	cfg            *config.Config
	engine         *gin.Engine
	port           string
	usecasemanager manager.UsecaseManager
	jwtutil        common.JwtUtil
}

func (sr *serverRequirement) SetUpServer() {
	rg := sr.engine.Group("api-putra-jaya")
	am := middleware.NewAuthMiddleware(sr.jwtutil)

	controller.NewAuthController(am, sr.usecasemanager.AuthUsecaseManager(), rg).AuthRouter()
	controller.NewUserController(am, sr.usecasemanager.UserUsecaseManager(), rg).UserRouter()
	controller.NewCategoryController(am, sr.usecasemanager.CategoryUsecaseManager(), rg).CategoryRouter()
	controller.NewProductController(am, sr.usecasemanager.ProductUsecaseManager(), rg).ProductRouter()
	controller.NewCustomController(am, sr.usecasemanager.CustomUsecaseManager(), rg).CustomRouter()
	controller.NewTransactionController(am, sr.usecasemanager.TransactionManager(), rg).TransactionRouter()
	controller.NewCompanyController(am, sr.usecasemanager.CompanyManager(), rg).CompanyRouter()
	controller.NewServiceController(am, sr.usecasemanager.ServiceManager(), rg).ServiceRouter()
	controller.NewDeliveryController(am, rg, sr.usecasemanager.DeliveryUsecaseManager()).DeliveryRouter()
	controller.NewPortfolioController(am, sr.usecasemanager.PortfolioManager(), rg).PortfolioRouter()
	controller.NewBlogController(am, sr.usecasemanager.UsecaseBlog(), rg).BlogRouter()
}

func (sr *serverRequirement) Run() {
	sr.SetUpServer()
	if err := sr.engine.Run(":" + sr.port); err != nil {
		panic(err)
	}

}

func NewServer() *serverRequirement {

	eng := gin.Default()
	cfg := config.Cfg()
	infra := manager.NewInfraManager(cfg)
	repo := manager.NewRepoManager(infra)
	jwtutil := common.NewJwtUtil(cfg)
	uc := manager.NewUsecaseManager(repo, jwtutil)
	middleware.CORSMiddleware(eng)

	return &serverRequirement{
		cfg:            cfg,
		engine:         eng,
		port:           cfg.APIPort,
		usecasemanager: uc,
		jwtutil:        jwtutil,
	}
}
