package manager

import "github.com/kriserohalia/SI-COMPANY-PROFILE/server/repository"

type RepoManager interface {
	AuthRepo() repository.AuthRepo
	UserRepo() repository.UserRepo
	CategoryRepo() repository.CategoryRepo
	ProductRepo() repository.ProdukRepo
	CustomRepo() repository.CustomRepo
	TransactionRepo() repository.TransactionRepo
	CompanyRepo() repository.CompanyRepo
	ServiceRepo() repository.ServiceRepo
	DelivRepo() repository.DeliveryRepo
	PortfolioRepo() repository.PortfolioRepo
	BlogRepo() repository.BlogRepo
	CouponRepo() repository.CouponRepository
}

type repoManager struct {
	infra Inframanager
}

// PortfolioRepo implements RepoManager.
func (repo *repoManager) PortfolioRepo() repository.PortfolioRepo {
	return repository.NewPortfolioRepo(repo.infra.Connection())
}

// ServiceRepo implements RepoManager.
func (repo *repoManager) ServiceRepo() repository.ServiceRepo {
	return repository.NewServiceRepo(repo.infra.Connection())
}

// CompanyRepo implements RepoManager.
func (repo *repoManager) CompanyRepo() repository.CompanyRepo {
	return repository.NewRepoCompany(repo.infra.Connection())
}

// TransactionRepo implements RepoManager.
func (repo *repoManager) TransactionRepo() repository.TransactionRepo {
	return repository.NewTransactionRepo(repo.infra.Connection())
}

// CustomRepo implements RepoManager.
func (repo *repoManager) CustomRepo() repository.CustomRepo {
	return repository.NewCustomRepo(repo.infra.Connection())
}

// ProductRepo implements RepoManager.
func (repo *repoManager) ProductRepo() repository.ProdukRepo {
	return repository.NewProductRepo(repo.infra.Connection())

}

// CategoryRepo implements RepoManager.
func (repo *repoManager) CategoryRepo() repository.CategoryRepo {
	return repository.NewCategoryRepo(repo.infra.Connection())
}

// AuthRepo implements RepoManager.
func (repo *repoManager) AuthRepo() repository.AuthRepo {
	return repository.NewAuthRepo(repo.infra.Connection())
}

func (repo *repoManager) UserRepo() repository.UserRepo {
	return repository.NewUserRepo(repo.infra.Connection())
}

// Delivery Repo
func (repo *repoManager) DelivRepo() repository.DeliveryRepo {
	return repository.NewDeliveryCostRepo(repo.infra.Connection())
}

// Blog Repo
func (repo *repoManager) BlogRepo() repository.BlogRepo {
	return repository.NewBlogRepo(repo.infra.Connection())
}

// Coupon Repo
func (rep *repoManager) CouponRepo() repository.CouponRepository {
	return repository.NewCouponRepo(rep.infra.Connection())
}

func NewRepoManager(infra Inframanager) RepoManager {
	return &repoManager{infra}

}
