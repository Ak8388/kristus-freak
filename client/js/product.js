document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchProduct');
    const addDataBtn = document.getElementById('addDataBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const token = localStorage.getItem('token');
    const productId = urlParams.get('id');
    const addProductForm = document.getElementById('addProductForm');
    const editProductForm = document.getElementById('editProductForm');

    document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const productId = this.getAttribute('data-product-id');
                editProduct(productId);
            });
        });

    if (productId) {
        fetchProductData(productId);
    } 

    if (fetchDataBtn) {
        fetchDataBtn.addEventListener('click', async function(event) {
            event.preventDefault();
            fetchData();
            addDataBtn.style.display = 'inline'; // Menampilkan tombol "Add Data"
        });
    }

    if (addDataBtn) {
        addDataBtn.addEventListener('click', function() {
            const addProductModal = new bootstrap.Modal(document.getElementById('addProductModal'), {
                backdrop: 'static', // Mengatur backdrop
                keyboard: false // Mengatur keyboard interaction
            });
            addProductModal.show();
        });
    }

    if (addProductForm) {
        addProductForm.addEventListener('submit', async function(event) {
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
                'id_category':parseInt(idCategory),
                'name':name,
                'price':parseInt(price),
                'weight':parseInt(weight),
                'stock':parseInt(stock),
                'description':description,
            }

            formData.append('json', JSON.stringify(objData));

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/product/add', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer '+token
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                // Reset form setelah submit berhasil
                addProductForm.reset();
                // Tutup modal setelah submit berhasil
                const addProductModal = bootstrap.Modal.getInstance(document.getElementById('addProductModal'));
                addProductModal.hide();
                // Refresh data produk jika diperlukan
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }
    
    if (editProductForm) {
        editProductForm.addEventListener('submit', async function(event) {
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
                'id':parseInt(id),
                'id_category':parseInt(idcat),
                'name':name,
                'price':parseInt(price),
                'weight':parseInt(weight),
                'stock':parseInt(stock),
                'description':des,
            }

            formData.append('json', JSON.stringify(objData));

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update`, {
                    method: 'PUT',
                    headers: {
                        'Authorization':"Bearer "+token
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
        const table = document.getElementById('table-product');
        const tableHead = document.createElement('thead');
        tableHead.innerHTML = `
            <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Aksi</th>
            </tr>
        `;

        // Kosongkan tabel sebelum memasukkan data baru
        table.innerHTML = '';
        table.appendChild(tableHead);
        const tableBody = document.createElement('tbody');
        const items = data.data || []; // Mengakses array data dari respons

        if (Array.isArray(items)) {
            items.forEach(item => {
                // const row = document.createElement('tr');
                // row.innerHTML = `
                //     <td>${item.id}</td>
                //     <td>${item.name}</td>
                //     <td>
                //         <button class="btn btn-warning btn-sm" onclick="editProduct (${item.id})">Edit</button>
                //         <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})">Delete</button>
                //     </td>
                // `;
                // tableBody.appendChild(row);
            });
        } else {
            console.error('Items is not an array:', items);
        }

        table.appendChild(tableBody);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}


    // Fungsi untuk memunculkan modal edit dengan data produk yang sesuai
    window.editProduct = async function(id) {
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
    document.addEventListener('click', function(event) {
        if (event.target.closest('.edit-button')) {
            const productId = event.target.closest('.edit-button').getAttribute('data-product-id');
            editProduct(productId); // Panggil fungsi editProduct dengan ID produk
        }
    });

    // Fungsi untuk menyimpan perubahan produk setelah diedit
    document.getElementById('saveEditButton').addEventListener('click', async function() {
        const editProductForm = document.getElementById('editProductForm');
        const productId = editProductForm.dataset.productId;

        const updatedProduct = {
            id_category: document.getElementById('EditInputIdCategory').value,
            name: document.getElementById('EditInputNameProduct').value,
            price: document.getElementById('EditInputPrice').value,
            stock: document.getElementById('EditInputStock').value,
            weight: document.getElementById('EditInputWeight').value,
            description: document.getElementById('EditInputDescription').value
        };

        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update/${productId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedProduct)
            });

            if (response.ok) {
                alert('Product updated successfully!');
                fetchData(); // Refresh data produk setelah update
                const editProductModal = bootstrap.Modal.getInstance(document.getElementById('editProductModal'));
                editProductModal.hide(); // Tutup modal setelah berhasil
            } else {
                alert('Failed to update product.');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    });

    // Event listener untuk button delete
document.addEventListener('click', function(event) {
    if (event.target && event.target.classList.contains('delete-button')) {
        const productId = event.target.getAttribute('data-product-id');
        showDeleteConfirmation(productId);
    }
});

// Fungsi untuk menampilkan konfirmasi penghapusan
function showDeleteConfirmation(productId) {
    swal({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!"
    }).then((result) => {
        if (result.value) {
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
    .then(result => {
        swal(
            'Deleted!',
            'Your product has been deleted.',
            'success'
        ).then(() => {
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        });
    })
    .catch(error => {
        swal(
            'Error!',
            'Failed to delete product.',
            'error'
        );
        console.error('Error deleting product:', error);
    });
}

