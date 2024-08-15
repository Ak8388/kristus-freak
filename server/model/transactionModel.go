package model

type Transaction struct {
	DetailTransaction DetailTransaction `json:"transaction_details"`
	ItemDetails       ItemDetails       `json:"item_details"`
	CustomerDetail    CustomerDetail    `json:"customer_details"`
}

type DetailTransaction struct {
	OrderID     string `json:"order_id"`
	GrossAmount int    `json:"gross_amount"`
}

type ItemDetails struct {
	Id          int    `json:"id"`
	Name        string `json:"name"`
	Price       int    `json:"price"`
	Qty         int    `json:"quantity"`
	TypeProduct string `json:"type_product"`
	Note        string `json:"note"`
}

type CustomerDetail struct {
	Id              int    `json:"id"`
	ShippingAddress string `json:"shipping_address"`
}

type TrackingPaymentStatus struct {
	TransactionTime   string `json:"transaction_time"`
	TransactionStatus string `json:"transaction_status"`
	TransactionId     string `json:"transaction_id"`
	StatusMessage     string `json:"status_message"`
	StatusCode        string `json:"status_code"`
	SignatureKey      string `json:"signature_key"`
	SettlementTime    string `json:"settlement_time"`
	PaymentType       string `json:"payment_type"`
	OrderId           string `json:"order_id"`
	MerchantId        string `json:"merchant_id"`
	GrossAmount       string `json:"gross_amount"`
	FraudStatus       string `json:"fraud_status"`
	Currency          string `json:"currency"`
}
