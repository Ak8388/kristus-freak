document.addEventListener('DOMContentLoaded', function () {
    // const addDataBtn = document.getElementById('addDataBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('token');
    const productId = urlParams.get('id');
    const addProductForm = document.getElementById('addProdButton');
    const editProductForm = document.getElementById('editProductForm');

    fetchData()
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            editProduct(productId);
        });
    });

    if (productId) {
        fetchProductData(productId);
    }

    if (addProductForm) {
        addProductForm.addEventListener('click', async function (event) {
            event.preventDefault();

            const name = document.getElementById('InputNameProduct').value;
            const idCategory = document.getElementById('InputIdCategory').value;
            const price = document.getElementById('price').value;
            const photos = document.getElementById('photos');
            const stock = document.getElementById('stock').value;
            const description = document.getElementById('description').value;
            const weight = document.getElementById('weight').value;

            const formData = new FormData();

            if (photos.files.length > 0) {
                formData.append('photos', photos.files[0]);
            }

            const objData = {
                'id_category': parseInt(idCategory),
                'name': name,
                'price': parseInt(price),
                'weight': parseInt(weight),
                'stock': parseInt(stock),
                'description': description,
            }

            formData.append('json', JSON.stringify(objData));

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/product/add', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + token
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                window.location.reload();
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }

    if (editProductForm) {
        editProductForm.addEventListener('submit', async function (event) {
            event.preventDefault();
            const id = editProductForm.dataset.productId;
            const idcat = document.getElementById('EditInputIdCategory').value;
            const name = document.getElementById('EditInputNameProduct').value;
            const price = document.getElementById('Editprice').value;
            const stock = document.getElementById('Editstock').value;
            const des = document.getElementById('Editdescription').value;
            const weight = document.getElementById('Editweight').value;
            const photos = document.getElementById('Editphotos');

            const formData = new FormData();

            if (photos.files.length > 0) {
                formData.append('photos', photos.files[0]);
            }

            const objData = {
                'id': parseInt(id),
                'id_category': parseInt(idcat),
                'name': name,
                'price': parseInt(price),
                'weight': parseInt(weight),
                'stock': parseInt(stock),
                'description': des,
            }

            formData.append('json', JSON.stringify(objData));

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': "Bearer " + token
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product edited successfully:', result);
                alert('Product edited successfully!');
                editProductForm.reset();
                const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                editProductModal.hide();
                fetchData();
            } catch (error) {
                console.error('Error editing product:', error);
                alert('Failed to edit product.');
            }
        });
    }
});

async function fetchData() {

    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/product/list'); // Ubah URL sesuai dengan endpoint Anda
        const data = await response.json();
        console.log(data); // Tambahkan log ini untuk melihat data yang diterima dari server

        // Kosongkan tabel sebelum memasukkan data baru
        const tableBody = document.getElementById('tbody');
        tableBody.innerHTML = '';
        const items = data.data || []; // Mengakses array data dari respons

        if (Array.isArray(items)) {
            items.forEach(item => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.id_category}</td>
                    <td>${item.name}</td>
                    <td><img class="img-prod" src="../../server/${item.photos}"></td>
                    <td>${item.price}</td>
                    <td>${item.stock}</td>
                    <td>${item.weight}</td>
                    <td>${item.description}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct (${item.id})">Edit</button>
                        <button type="button" class="btn btn-link btn-danger delete-button" data-id="${item.id}" title="Remove" onclick="showDeleteConfirmation(${item.id})">
                                    <i class="fa fa-times"></i>
                                </button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        } else {
            console.error('Items is not an array:', items);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


// Fungsi untuk memunculkan modal edit dengan data produk yang sesuai
window.editProduct = async function (id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/product/${id}`);
        const product = await response.json();

        // Isi form modal edit dengan data produk
        document.getElementById('EditInputIdCategory').value = product.data.id_category;
        document.getElementById('EditInputNameProduct').value = product.data.name;
        document.getElementById('EditInputPrice').value = product.data.price;
        document.getElementById('EditInputStock').value = product.data.stock;
        document.getElementById('EditInputWeight').value = product.data.weight;
        document.getElementById('EditInputDescription').value = product.data.description;

        // Simpan ID produk di form untuk submit
        const editProductForm = document.getElementById('editProductForm');
        editProductForm.dataset.productId = id;

        // Tampilkan modal edit
        const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {
            backdrop: 'static',
            keyboard: false
        });
        editProductModal.show();
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Event listener untuk tombol Edit
document.addEventListener('click', function (event) {
    if (event.target.closest('.edit-button')) {
        const productId = event.target.closest('.edit-button').getAttribute('data-product-id');
        editProduct(productId); // Panggil fungsi editProduct dengan ID produk
    }
});

// Fungsi untuk menyimpan perubahan produk setelah diedit
document.getElementById('saveEditButton').addEventListener('click', async function () {
    const editProductForm = document.getElementById('editProductForm');
    const token = localStorage.getItem('token');
    const id = editProductForm.dataset.productId;
    const idcat = document.getElementById('EditInputIdCategory').value;
    const name = document.getElementById('EditInputNameProduct').value;
    const price = document.getElementById('EditInputPrice').value;
    const stock = document.getElementById('EditInputStock').value;
    const des = document.getElementById('EditInputDescription').value;
    const weight = document.getElementById('EditInputWeight').value;
    const photos = document.getElementById('EditInputIdFoto');

    const formData = new FormData();

    if (photos.files.length > 0) {
        formData.append('photos', photos.files[0]);
    }

    const objData = {
        'id': parseInt(id),
        'id_category': parseInt(idcat),
        'name': name,
        'price': parseInt(price),
        'weight': parseInt(weight),
        'stock': parseInt(stock),
        'description': des,
    }

    formData.append('json', JSON.stringify(objData));

    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update`, {
            method: 'PUT',
            headers: {
                'Authorization': "Bearer " + token
            },
            body: formData
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Product edited successfully:', result)
        alert('Product edited successfully!');
        editProductForm.reset();
        const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
        editProductModal.hide();
        fetchData();
    } catch (error) {
        console.error('Error editing product:', error);
        alert('Failed to edit product.');
    }
});

// Event listener untuk button delete
document.addEventListener('click', function (event) {
    if (event.target && event.target.classList.contains('delete-button')) {
        const productId = event.target.getAttribute('data-product-id');
        showDeleteConfirmation(productId);
    }
});

function showDeleteConfirmation(productId) {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",  // Menggunakan "icon" bukan "type"
        buttons: {
            cancel: {
                text: "No, cancel!",
                value: false,
                visible: true,
                className: "btn btn-danger",
                closeModal: true,
            },
            confirm: {
                text: "Yes, delete it!",
                value: true,
                visible: true,
                className: "btn btn-primary",
                closeModal: false // Biarkan terbuka sampai kita selesai
            }
        },
        dangerMode: true,
    }).then((isConfirm) => {
        if (isConfirm) {
            // Memanggil fungsi delete setelah konfirmasi
            deleteProduct(productId);
        }
    });
}


// Fungsi untuk menghapus produk
function deleteProduct(productId) {
    fetch(`http://localhost:8081/api-putra-jaya/product/delete/${productId}`, {
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
    .then( () => {
        swal({
            title: 'Deleted!',
            text: 'Service has been deleted.',
            icon: 'success'
        }).then(() => {
            window.location.reload(); // Refresh data setelah penghapusan berhasil
        });
    })
    .catch(error => {
        swal({
            title: 'Error!',
            text: 'Failed to delete service.',
            icon: 'error'
        });
        console.error('Error deleting service:', error);
    });
}

