document.addEventListener('DOMContentLoaded',async e=>{
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('tbody');
    await fetch('http://localhost:8081/api-putra-jaya/transaction/transaction-owner?status=',{headers:{"Authorization":"Bearer "+token}})
    .then(res=>{
        if(!res.ok){
            throw new Error("error");
        }
        return res.json()
    })
    .then(resData=>{
        resData.data.map(data=>{
            let statusText = "";

            if(data.status == 1){
                statusText="Dibuat";
            }else if(data.status == 2){
                statusText="Sudah Dibayar";
            }else if(data.status == 3){
                statusText="Selesai";
            }else if(data.status == 4){
                statusText="Dalam Pengiriman";
            }else if(data.status == 5){
                statusText="Di Batalkan";
            }else if(data.status == 6){
                statusText="Pembayaran kadaluarsa";
            }
            
            const trow = document.createElement('tr');
            trow.innerHTML=`
                <td>${data.id}</td>
                <td>${data.itemDetails.id}</td>
                <td>${data.customerDetail.id}</td>
                <td>${data.detailTransaction.order_id}</td>
                <td>${data.itemDetails.type_product}</td>
                <td>${data.itemDetails.quantity}</td>
                <td>${data.detailTransaction.gross_amount}</td>
                <td>${data.customerDetail.name}</td>
                <td>${data.customerDetail.phoneNumber}</td>
                <td>${data.customerDetail.shipping_address}</td>
                <td>${data.customerDetail.postCode}</td>
                <td>${data.itemDetails.note}</td>
                <td>${statusText}</td>
                <td>
                    <button class="btn btn-warning btn-sm" onclick="editProduct(${data.id})">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${data.id})">Delete</button>
                </td>
            `
            tbody.appendChild(trow);
        })
        
    })
    .catch(err=>{
        alert('error nih');
    });

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            editProduct(productId);
        });
    });
})

window.editProduct = async function (id) {

}