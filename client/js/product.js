document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchProduct');
    const addDataBtn = document.getElementById('addDataBtn');
    const urlParams = new URLSearchParams(window.location.search);
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
            event.preventDefault(); // Mencegah form dari submit secara default

            const name = document.getElementById('InputNameProduct').value;
            const idCategory = document.getElementById('InputIdCategory').value;

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/product/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_category: parseInt(idCategory, 10), name: name })
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
            const name = document.getElementById('EditInputNameProduct').value;
            const idCategory = document.getElementById('EditInputIdCategory').value;

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/product/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id_category: parseInt(idCategory, 10), name: name })
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
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.id}</td>
                    <td>${item.name}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editProduct (${item.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deleteProduct(${item.id})">Delete</button>
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


    // Fungsi untuk memunculkan modal edit dengan data produk yang sesuai
    window.editProduct = async function(id) {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/product/${id}`);
            const product = await response.json();
            console.log(product);

            // Isi form edit dengan data produk
            document.getElementById('EditInputIdCategory').value = product.id_category;
            document.getElementById('EditInputNameProduct').value = product.name;
            editProductForm.dataset.productId = id;

            const editProductModal = new bootstrap.Modal(document.getElementById('editProductModal'), {
                backdrop: 'static',
                keyboard: false
            });
            editProductModal.show();
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    // // Panggil fetchData saat halaman dimuat
    // fetchData(); 

function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://localhost:8081/api-putra-jaya/product/delete/${id}`, {
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
            console.log('Product deleted successfully:', result);
            alert('Product deleted successfully!');
            // Refresh data produk setelah berhasil menghapus
            fetchData();
        })
        .catch(error => {
            console.error('Error deleting product:', error);
            alert('Failed to delete product.');
        });
    }
}


async function fetchProductData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/product/${id}`);
        const data = await response.json();
        document.getElementById('EditNameProduct').value = data.name;
        document.getElementById('EditIdCategory').value = data.idCategory;
        const editForm = document.getElementById('editform');
        editForm.setAttribute('data-id', id);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

