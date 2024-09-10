document.addEventListener('DOMContentLoaded',async e=>{
    fetchData()
})

window.deleteProduct = async function (id) {
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction`,{method:"DELETE",headers:{"Authorization":"Bearer "+token},body:JSON.stringify({'orderId':id})});
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        fetchData()
        alert('success delete data');
    }catch(error){
        alert(error);
    }
}

window.statusKirim = async function(id){
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/status`,{method:"PUT",headers:{"Authorization":"Bearer "+token},body:JSON.stringify({'orderId':id,'stId':parseInt(4)})});
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        fetchData()
        alert('success update status');
    }catch(error){
        alert(error);
    }
}

window.cancelTransaction = async function(id){
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/cancel`,{method:"PUT",headers:{"Authorization":"Bearer "+token},body:JSON.stringify({'orderId':id})});
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        fetchData()
        alert('success delete data');
    }catch(error){
        alert(error);
    }
}

window.statusFinish = async function(id){
    const token = localStorage.getItem('token');
    try{
        const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/status`,{method:"PUT",headers:{"Authorization":"Bearer "+token},body:JSON.stringify({'orderId':id,'stId':parseInt(3)})});
    
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    
        const data = await response.json();
        fetchData()
        alert('success delete data');
    }catch(error){
        alert(error);
    }
}

async function fetchData(){
    const token = localStorage.getItem('token');
    const tbody = document.getElementById('tbody');
    tbody.innerHTML=''
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
            console.log(data);
            
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
            `
            const tdAct = document.createElement('td');
            if(data.status == 1 || data.status == 2){
                tdAct.innerHTML=`
                    <button class="btn btn-success btn-sm" onclick="statusKirim('${data.detailTransaction.order_id}')">Kirim</button>
                    <button class="btn btn-danger btn-sm" onclick="cancelTransaction('${data.detailTransaction.order_id}')">Cancel</button>
                `
            }else if(data.status == 3 || data.status == 5 || data.status == 6){
                tdAct.innerHTML=`
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct('${data.detailTransaction.order_id}')">Hapus</button>
                `
            }else if(data.status == 4){
                tdAct.innerHTML=`
                    <button class="btn btn-info btn-sm" onclick="statusFinish('${data.detailTransaction.order_id}')">Selesai</button>
                `
            }
            trow.appendChild(tdAct);
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
}