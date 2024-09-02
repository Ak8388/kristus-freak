package manager

import (
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/usecase"
	"github.com/kriserohalia/SI-COMPANY-PROFILE/server/util/common"
)

type UsecaseManager interface {
	AuthUsecaseManager() usecase.AuthUsecase
	UserUsecaseManager() usecase.UserUsecase
	CategoryUsecaseManager() usecase.CategoryUseCase
	ProductUsecaseManager() usecase.ProductUsecase
	CustomUsecaseManager() usecase.CustomUsecase
	TransactionManager() usecase.TransactionUsecase
	CompanyManager() usecase.CompanyUsecase
	ServiceManager() usecase.ServiceUsecase
	DeliveryUsecaseManager() usecase.DeliveryUsecase
	PortfolioManager() usecase.PortfolioUsecase
}

type usecaseManager struct {
	repo    RepoManager
	jwtutil common.JwtUtil
}

// PortfolioManager implements UsecaseManager.
func (ucm *usecaseManager) PortfolioManager() usecase.PortfolioUsecase {
	return usecase.NewPortfolioUsecase(ucm.repo.PortfolioRepo())
}

// ServiceManager implements UsecaseManager.
func (ucm *usecaseManager) ServiceManager() usecase.ServiceUsecase {
	return usecase.NewServiceUsecase(ucm.repo.ServiceRepo())
}

// CompanyManager implements UsecaseManager.
func (ucm *usecaseManager) CompanyManager() usecase.CompanyUsecase {
	return usecase.NewUsecaseCompany(ucm.repo.CompanyRepo())
}

// TransactionManager implements UsecaseManager.
func (ucm *usecaseManager) TransactionManager() usecase.TransactionUsecase {
	return usecase.NewTransactionUsecase(ucm.repo.TransactionRepo())
}

// CustomUsecaseManager implements UsecaseManager.
func (ucm *usecaseManager) CustomUsecaseManager() usecase.CustomUsecase {
	return usecase.NewCustomUsecase(ucm.repo.CustomRepo())
}

// ProductUsecaseManager implements UsecaseManager.
func (ucm *usecaseManager) ProductUsecaseManager() usecase.ProductUsecase {
	return usecase.NewProductUsecase(ucm.repo.ProductRepo())
}

// CategoryUsecaseManager implements UsecaseManager.
func (ucm *usecaseManager) CategoryUsecaseManager() usecase.CategoryUseCase {
	return usecase.NewCategoryUsecase(ucm.repo.CategoryRepo())
}

// AuthUsecaseManager implements UsecaseManager.
func (ucm *usecaseManager) AuthUsecaseManager() usecase.AuthUsecase {
	return usecase.NewAuthUsecase(ucm.repo.AuthRepo(), ucm.UserUsecaseManager(), ucm.jwtutil)
}

func (ucm *usecaseManager) UserUsecaseManager() usecase.UserUsecase {
	return usecase.NewUserUsecase(ucm.repo.UserRepo())
}

func (ucm *usecaseManager) DeliveryUsecaseManager() usecase.DeliveryUsecase {
	return usecase.NewDeliveryCostUsecase(ucm.repo.DelivRepo())
}

func NewUsecaseManager(repo RepoManager, jwtutil common.JwtUtil) UsecaseManager {
	return &usecaseManager{
		repo,
		jwtutil,
	}
}
