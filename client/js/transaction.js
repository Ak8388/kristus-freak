document.addEventListener('DOMContentLoaded', function () {
    
    const token = localStorage.getItem('token');
	if(token != undefined && token != ""){
		document.getElementById('log-btn').style.display='none';
		document.getElementById('historyOrder').addEventListener('click',e=>{
			location.href='./history.html';
		});
	}else if(token == undefined || token==""){
		document.getElementById('logout-btn').style.display='none';

		document.getElementById('historyOrder').addEventListener('click',e=>{
			location.href='./login.html';
		});
	}

    const addTransaction = document.getElementById('addTransaction');
    const showDataBtn = document.getElementById('showDataBtn');
    const addTransactionForm = document.getElementById('addTransactionForm');
    const urlParams = new URLSearchParams(window.location.search);
    const transactionlId = urlParams.get('id');
    const editTransactionForm = document.getElementById('editTransactionForm');
    let status = "";
    const btnAll = document.getElementById('btn-all');
    const btnPack = document.getElementById('btn-packing');
    const btnUnpaid = document.getElementById('btn-unpaid');
    const btnOnDel = document.getElementById('btn-on-del');
    const btnCancel = document.getElementById('btn-cancel');
    const btnFinish = document.getElementById('btn-finish');

    btnAll.addEventListener('click', e => {
        status = "";
        fetchData(status);
    })

    btnPack.addEventListener('click', e => {
        status = "2";
        fetchData(status);
    })

    btnUnpaid.addEventListener('click', e => {
        status = "1";
        fetchData(status);
    })

    btnOnDel.addEventListener('click', e => {
        status = "4";
        fetchData(status);
    })

    btnCancel.addEventListener('click', e => {
        status = "5";
        fetchData(status);
    })

    btnFinish.addEventListener('click', e => {
        status = "3";
        fetchData(status);
    })

    fetchData(status);

    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const detailId = this.getAttribute('transaction-id');
            editDetailForm(detailId);
        });
    });

    if (transactionlId) {
        fetchTransaction(transactionlId);
    }


    if (showDataBtn) {
        showDataBtn.addEventListener('click', function () {
            fetchData();
            if (addTransaction) {
                addTransaction.style.display = 'inline'
            }
        });

    }

    if (addTransactionForm) {
        addTransactionForm.addEventListener('submit', async function (event) {
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

            if (!token) {
                alert('akses dibatasi');
                return;
            }

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/transaction/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id: parseInt(id, 10),
                        produk_id: parseInt(produk_id, 10),
                        id_user: parseInt(idUser, 10),
                        amount: parseInt(Amount, 10),
                        type_product: type_product,
                        qty: parseInt(qty, 10),
                        address_shipping: AddressShipping,
                        note: Note,
                        order_id: parseInt(OrderId, 10),
                        status_id: parseInt(StatusId, 10)
                    })
                });
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
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

    if (editTransactionForm) {
        editTransactionForm.addEventListener('submit', async function (event) {
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
                const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        id: parseInt(id, 10),
                        produk_id: parseInt(produk_id, 10),
                        id_user: parseInt(idUser, 10),
                        amount: parseInt(Amount, 10),
                        type_product: TypeProduct,
                        qty: parseInt(qty, 10),
                        address_shipping: AddressShipping,
                        note: Note,
                        order_id: parseInt(OrderId, 10),
                        status_id: parseInt(StatusId, 10)
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


function deleteTransaction(id) {
    if (confirm('Are you sure you want to delete this transaction?')) {
        fetch(`http://localhost:8081/api-putra-jaya/transaction/delete/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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

async function fetchData(status) {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/transaction/transaction-user?status=', { headers: { "Authorization": 'Bearer ' + token } }); // URL endpoint
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        // Kosongkan tabel sebelumnya
        const tableBody = document.getElementById('order-items');
        const items = data.data || []; // Mengakses array data dari respons
        console.log(data);
        if (Array.isArray(items)) {
            items.forEach(async item => {
                tableBody.innerHTML = '';
                if (status != "") {
                    if (item.status == status) {
                        const row = document.createElement('tr');
                        const response2 = await fetch(`http://localhost:8081/api-putra-jaya/product/user-product/${item.itemDetails.id}`); // URL endpoint
                        if (!response2.ok) throw new Error(`HTTP error! Status: ${response2.status}`);
                        const data2 = await response2.json();
                        console.log(data2);
                        let statusText = "";

                        if (item.status == 1) {
                            statusText = "Dibuat";
                        } else if (item.status == 2) {
                            statusText = "Sedang di kemas";
                        } else if (item.status == 3) {
                            statusText = "Selesai";
                        } else if (item.status == 4) {
                            statusText = "Dalam Pengiriman";
                        } else if (item.status == 5) {
                            statusText = "Di Batalkan";
                        } else if (item.status == 6) {
                            statusText = "Pembayaran kadaluarsa";
                        }

                        row.innerHTML = `
                            <td><img src="../server/${data2.data.photos}" class="prod-img"></td>
                            <td>${data2.data.name}</td>
                            <td>${data2.data.price}</td>
                            <td>${item.itemDetails.quantity}</td>
                            <td>${item.detailTransaction.gross_amount}</td>
                            <td>${statusText}</td>
                            <td>
                            </td>
                        `;
                        if (item.status == 1) {
                            const link = localStorage.getItem('redirectUrl');
                            const tdAct = document.createElement('td');
                            const orderId = item.detailTransaction.order_id.toString();
                            row.appendChild(tdAct);
                            tdAct.innerHTML = `
                                <a href='${link}' target='blank'><button class="btn btn-warning btn-sm")">Bayar</button></a>
                                <button class="btn btn-danger btn-sm" onclick="editDetail('${orderId}')">Cancel</button>
                            `;
                        } else if (item.status == 2) {
                            const tdAct = document.createElement('td');
                            row.appendChild(tdAct);
                            tdAct.innerHTML = `
                            <a href="https://api.whatsapp.com/send?phone=6283130668561&text=Krse%20bisa%20rupanya%20kau%batalkan%20pesananku" target="_blank" style="z-index: 100;"><button class="btn btn-danger btn-sm" onclick="cancelPay(${item.detailTransaction.order_id})">Cancel</button></a>`
                        }
                        tableBody.appendChild(row);
                    }
                } else {
                    tableBody.innerHTML = '';
                    const row = document.createElement('tr');
                    const response2 = await fetch(`http://localhost:8081/api-putra-jaya/product/user-product/${item.itemDetails.id}`); // URL endpoint
                    if (!response2.ok) throw new Error(`HTTP error! Status: ${response2.status}`);
                    const data2 = await response2.json();

                    let statusText = "";

                    if (item.status == 1) {
                        statusText = "Dibuat";
                    } else if (item.status == 2) {
                        statusText = "Sedang di kemas";
                    } else if (item.status == 3) {
                        statusText = "Selesai";
                    } else if (item.status == 4) {
                        statusText = "Dalam Pengiriman";
                    } else if (item.status == 5) {
                        statusText = "Di Batalkan";
                    } else if (item.status == 6) {
                        statusText = "Pembayaran kadaluarsa";
                    }

                    row.innerHTML = `
                    <td><img src="../server/${data2.data.photos}" class="prod-img"></td>
                    <td>${data2.data.name}</td>
                    <td>${data2.data.price}</td>
                    <td>${item.itemDetails.quantity}</td>
                    <td>${item.detailTransaction.gross_amount}</td>
                    <td>${statusText}</td>
                    `;

                    if (item.status == 1) {
                        const link = localStorage.getItem('redirectUrl');
                        const tdAct = document.createElement('td');
                        const orderId = item.detailTransaction.order_id.toString();
                        row.appendChild(tdAct);
                        tdAct.innerHTML = `
                        <a href='${link}' target='blank'><button class="btn btn-warning btn-sm" onclick="">Bayar</button></a>
                        <button class="btn btn-danger btn-sm" onclick="editDetail('${orderId}')">Cancel</button>
                        `;
                    } else if (item.status == 2) {
                        const tdAct = document.createElement('td');
                        row.appendChild(tdAct);
                        tdAct.innerHTML = `
                        <a href="https://api.whatsapp.com/send?phone=6283130668561&text=Krise bisa rupanya kau batalkan pesananku" target="_blank" style="z-index: 100;"><button class="btn btn-danger btn-sm" onclick="cancelPay(${item.detailTransaction.order_id})">Cancel</button></a>`
                    }
                    tableBody.appendChild(row);
                }
            });
        } else {
            console.error('Items is not an array:', items);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


window.editDetail = async function (id) {
    try {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/transaction/cancel`, { method: "PUT", headers: { "Authorization": "Bearer " + token }, body: JSON.stringify({ "orderId": id }) });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            alert('Success cancel transaction');
            fetchData("")
        } catch (error) {
            alert("something went wrong")
        }
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
        document.getElementById('EditInputProduct').value = detail.price;
        document.getElementById('EditInputIdUser').value = detail.photos;
        document.getElementById('EditInputAmount').value = detail.stock;
        document.getElementById('EditInputTypeProduct').value = detail.description;
        document.getElementById('EditInputQuantity').value = detail.description;
        document.getElementById('EditInputAddressShipping').value = detail.description;
        document.getElementById('EditInputNote').value = detail.description;
        document.getElementById('EditInputOrderId').value = detail.description;
        document.getElementById('EditInputStatusId').value = detail.description;

        const editTransactionForm = document.getElementById('editTransactionForm');
        editTransactionForm.setAttribute('data-id', id);
    } catch (error) {
        console.error('Error fetching transaction data:', error);

    }
}
const buttons = document.querySelectorAll('.d-flex button');
// Fungsi untuk mereset warna tombol dan menambahkan class active pada tombol yang diklik
buttons.forEach(button => {
    button.addEventListener('click', function() {
        buttons.forEach(btn => btn.classList.remove('active')); 
        this.classList.add('active');
    });
});

function logout() {
	// Tambahkan logika untuk logout, misalnya menghapus token dari local storage
	localStorage.removeItem('token');

	// Redirect ke halaman login atau home
	window.location.href = './login.html';
}