document.addEventListener('DOMContentLoaded', function(){
    const addTransaction = document.getElementById('addTransaction');
    const showDataBtn = document.getElementById('showDataBtn');
    const addTransactionForm = document.getElementById('addTransactionForm');
    const urlParams = new URLSearchParams(window.location.search);
    const transactionlId = urlParams.get('id');
    const editTransactionForm = document.getElementById('editTransactionForm');

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function(){
            const detailId = this.getAttribute('transaction-id');
            editDetailForm(detailId);
        });
    });

    if(transactionlId) {
        fetchTransaction(transactionlId);
    }


    if (showDataBtn) {
        showDataBtn.addEventListener('click', function() {
            fetchData();
            if(addTransaction) {
                addTransaction.style.display = 'inline'
            }
        });

    }

    if(addTransactionForm) {
        addTransactionForm.addEventListener('submit', async function(event){
            event.preventDefault();

            const idTransaction = document.getElementById('InputIdTransaction')
            const idProduk = document.getElementById('InputIdProduct')
            const idUser = document.getElementById('InputIdUser')
            const Amount = document.getElementById('InputAmount')
            const TypeProduct = document.getElementById('InputTypeProduct')
            const Quantity = document.getElementById('InputQuantity')
            const AddressShipping = document.getElementById('InputAddressShipping')
            const Note = document.getElementById('InputNote')
            const OrderId = document.getElementById('InputOrderId')
            const StatusId = document.getElementById('InputStatusId')

            const token = localStorage.getItem('token');
            console.log(token);

            if (!token) {
                alert('akses dibatasi');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/transaction/add',{
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id:parseInt(id,10),
                        produk_id:parseInt(produk_id,10),
                        id_user:parseInt(idUser,10),
                        amount:parseInt(Amount,10),
                        type_product:type_product,
                        qty:parseInt(qty,10),
                        address_shipping:AddressShipping,
                        note:Note,
                        order_id:parseInt(OrderId,10),
                        status_id:parseInt(StatusId,10)
                    })
                });
                if (!response.ok){
                    throw new Error (`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                addTransactionForm.reset();
                const addTransactionModal = bootstrap.Modal.getInstance(document.getElementById('addTransactionModal'));
                addTransactionModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }

    if(editTransactionForm){
        editTransactionForm.addEventListener('submit', async function(event){
            event.preventDefault();
            const idTransaction = document.getElementById('InputIdTransaction')
            const idProduk = document.getElementById('InputIdProduct')
            const idUser = document.getElementById('InputIdUser')
            const Amount = document.getElementById('InputAmount')
            const TypeProduct = document.getElementById('InputTypeProduct')
            const Quantity = document.getElementById('InputQuantity')
            const AddressShipping = document.getElementById('InputAddressShipping')
            const Note = document.getElementById('InputNote')
            const OrderId = document.getElementById('InputOrderId')
            const StatusId = document.getElementById('InputStatusId')
            
            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/${id}`,{
                    method:'PUT',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body: JSON.stringify({
                        id:parseInt(id,10),
                        produk_id:parseInt(produk_id,10),
                        id_user:parseInt(idUser,10),
                        amount:parseInt(Amount,10),
                        type_product:type_product,
                        qty:parseInt(qty,10),
                        address_shipping:AddressShipping,
                        note:Note,
                        order_id:parseInt(OrderId,10),
                        status_id:parseInt(StatusId,10)
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product edited successfully:', result);
                alert('Product edited successfully!');
                editTransactionForm.reset();
                const editTransactionModal = bootstrap.Modal.getInstance(document.getElementById('editTransactionModal'));
                editTransactionModal.hide();
                fetchData();

            } catch (error) {
                console.error('Error editing product:', error);
                alert('Failed to edit product.');
            }
        });
    }
});


function deleteTransaction(id){
    if(confirm('Are you sure you want to delete this transaction?')){
        fetch(`http://localhost:8081/api-putra-jaya/transaction/delete/${id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(result => {
            console.log('Transaction deleted successfully:', result);
            alert('Transaction deleted successfully!');
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        });
    }
}

async function fetchData() {
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/transaction/list'); // URL endpoint
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        console.log(data);
        const table = document.getElementById('table-transaction');
         // Kosongkan tabel sebelumnya

        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>ID Produk</th>
                <th>ID User</th>
                <th>Amount</th>
                <th>Type Product</th>
                <th>QTY</th>
                <th>Address Shipping</th>
                <th>Note</th>
                <th>Order Id</th>
                <th>Status Id </th>
            </tr>
        `;
        table.innerHTML = '';
        table.appendChild(tableHead);
        const tableBody = document.createElement('tbody');
        const items = data.data || []; // Mengakses array data dari respons

        if (Array.isArray(items)) {
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.produk_id}</td>
                    <td>${item.id_user}</td>
                    <td>${item.transactions_details.amount}</td>
                    <td>${item.item_details.type_product}</td>
                    <td>${item.item_details.qty}</td>
                    <td>${item.customer_details.address_shipping}</td>
                    <td>${item.item_details.note}</td>
                    <td>${item.transactions_details.order_id}</td>
                    <td>${item.status_id}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editDetail(${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteDetail(${item.id})">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.error('Items is not an array:', items);
        }

        table.appendChild(tableBody);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


window.editDetail = async function(id){
    try {
        const response = await fetch (`http://localhost:8081/api-putra-jaya/transaction/${id}`);
        const detail = await response.json();
        console.log(detail);

        document.getElementById('EditInputIdTransaction').value = detail.id;
         document.getElementById('EditInputProduct').value= detail.price;
         document.getElementById('EditInputIdUser').value = detail.photos;
         document.getElementById('EditInputAmount').value = detail.stock;
         document.getElementById('EditInputTypeProduct').value = detail.description;
         document.getElementById('EditInputQuantity').value = detail.description;
         document.getElementById('EditInputAddressShipping').value = detail.description;
         document.getElementById('EditInputNote').value = detail.description;
         document.getElementById('EditInputOrderId').value = detail.description;
         document.getElementById('EditInputStatusId').value = detail.description;


         editTransactionForm.dataset.detailId = id;

         const editTransactionModal = new bootstrap.Modal(document.getElementById('editTransactionModal'), {
            backdrop:'static',
            keyboard:false
         });
         editTransactionModal.show();
    } catch (error) {
        console.error('Error fetching product data:', error);
        
    }
};

async function fetchTransaction(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const detail = await response.json();

        document.getElementById('EditInputIdTransaction').value = detail.id;
        document.getElementById('EditInputProduct').value= detail.price;
        document.getElementById('EditInputIdUser').value = detail.photos;
        document.getElementById('EditInputAmount').value = detail.stock;
        document.getElementById('EditInputTypeProduct').value = detail.description;
        document.getElementById('EditInputQuantity').value = detail.description;
        document.getElementById('EditInputAddressShipping').value = detail.description;
        document.getElementById('EditInputNote').value = detail.description;
        document.getElementById('EditInputOrderId').value = detail.description;
        document.getElementById('EditInputStatusId').value = detail.description;

        const editTransactionForm = document.getElementById('editTransactionForm');
        editTransactionForm.setAttribute('data-id',id);
    } catch (error) {
        console.error('Error fetching transaction data:', error);
        
    }
}