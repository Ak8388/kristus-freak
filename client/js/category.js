document.addEventListener('DOMContentLoaded', function() {
    const fetchDataBtn = document.getElementById('fetchProduct');
    const addDataBtn = document.getElementById('addDataBtn');
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('id');
    const addCategoryForm = document.getElementById('addCategoryForm');
    const editCategoryForm = document.getElementById('editCategoryForm');

    document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const categoryId = this.getAttribute('data-category-id');
                editCategory(categoryId);
            });
        });

    if (categoryId) {
        fetchCategoryData(categoryId);
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
            const addProductModal = new bootstrap.Modal(document.getElementById('addCategoryModal'), {
                backdrop: 'static', // Mengatur backdrop
                keyboard: false // Mengatur keyboard interaction
            });
            addCategoryModal.show();
        });
    }

    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Mencegah form dari submit secara default

            const name = document.getElementById('InputNameCategory').value;

            try {
                const response = await fetch('http://localhost:8081/api-putra-jaya/category/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: name })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product added successfully:', result);
                alert('Product added successfully!');
                // Reset form setelah submit berhasil
                addCategoryForm.reset();
                // Tutup modal setelah submit berhasil
                const addCategoryModal = bootstrap.Modal.getInstance(document.getElementById('addCategoryModal'));
                addCategoryModal.hide();
                // Refresh data produk jika diperlukan
                fetchData();
            } catch (error) {
                console.error('Error adding product:', error);
                alert('Failed to add product.');
            }
        });
    }
    
    if (editCategoryForm) {
        editCategoryForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const id = editCategoryForm.dataset.categoryId;
            const name = document.getElementById('EditInputNameCategory').value;

            try {
                const response = await fetch(`http://localhost:8081/api-putra-jaya/category/update/${id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name: name })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const result = await response.json();
                console.log('Product edited successfully:', result);
                alert('Product edited successfully!');
                editCategoryForm.reset();
                const editCategoryModal = bootstrap.Modal.getInstance(document.getElementById('editCategoryModal'));
                editCategoryModal.hide();
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
        const response = await fetch('http://localhost:8081/api-putra-jaya/category/list'); // Ubah URL sesuai dengan endpoint Anda
        const data = await response.json();
        console.log(data); // Tambahkan log ini untuk melihat data yang diterima dari server
        const table = document.getElementById('table-category');
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
                        <button class="btn btn-warning btn-sm" onclick="editCategory (${item.id})">Edit</button>
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
    window.editCategory = async function(id) {
        try {
            const response = await fetch(`http://localhost:8081/api-putra-jaya/category/${id}`);
            const product = await response.json();
            console.log(product);

            // Isi form edit dengan data produk
            document.getElementById('EditInputNameCategory').value = product.name;
            editCategoryForm.dataset.categoryId = id;

            const editCategoryModal = new bootstrap.Modal(document.getElementById('editCategoryModal'), {
                backdrop: 'static',
                keyboard: false
            });
            editCategoryModal.show();
        } catch (error) {
            console.error('Error fetching product data:', error);
        }
    };

    // // Panggil fetchData saat halaman dimuat
    // fetchData(); 

function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        fetch(`http://localhost:8081/api-putra-jaya/category/delete/${id}`, {
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


async function fetchCategoryData(id) {
    try {
        const response = await fetch(`http://localhost:8081/api-putra-jaya/category/${id}`);
        const data = await response.json();
        document.getElementById('EditNameCategory').value = data.name;
        const editForm = document.getElementById('editform');
        editForm.setAttribute('data-id', id);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

