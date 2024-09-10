document.addEventListener('DOMContentLoaded', function() {
    fetchData();
    fetchDataSum();
});

async function fetchData() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Akses dibatasi');
            return;
        }

        const response = await fetch('http://localhost:8081/api-putra-jaya/user/list-user', {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log(data);

        const tableBody = document.getElementById('tbody');
        const infoUser = document.getElementById('info-user');

        // Menampilkan data di tabel
        if (tableBody) {
            tableBody.innerHTML = '';
            const items = data.data || [];

            if (Array.isArray(items)) {
                const filteredItems = items.filter(item => item.role === 'CUSTOMER');
                filteredItems.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                        <td>
                            <div class="form-button-action">
                                <button type="button" class="btn btn-link btn-danger delete-button" onclick="showDeleteConfirmation(${item.id})" title="Remove">
                                    <i class="fa fa-times"></i>
                                </button>
                            </div>
                        </td>
                    `;
                    tableBody.appendChild(row);
                });
            } else {
                console.error("Items is not an array:", items);
            }
        }
        if (infoUser) {
            infoUser.innerHTML = '';
            const items = data.data || [];

            if (Array.isArray(items)) {
                const filteredItems = items.filter(item => item.role === 'CUSTOMER');
                filteredItems.forEach((item, index) => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${item.name}</td>
                        <td>${item.email}</td>
                    `;
                    infoUser.appendChild(row);
                });
            } else {
                console.error("Items is not an array:", items);
            }
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
// async function fetchDataSum() {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('Akses dibatasi');
//             return;
//         }

//         const projectEndpoint = 'http://localhost:8081/api-putra-jaya/portfolio/list';
//         const serviceEndpoint = 'http://localhost:8081/api-putra-jaya/service/list';
//         const transactionEndpoint = 'http://localhost:8081/api-putra-jaya/transaction/list';
//         const customerEndpoint = 'http://localhost:8081/api-putra-jaya/user/list-user';
//         const productEndpoint = 'http://localhost:8081/api-putra-jaya/product/list';
//         const categoryEndpoint = 'http://localhost:8081/api-putra-jaya/category/list';

//         const [projects, services, transactions, customers, products, categories] = await Promise.all([
//             fetch(projectEndpoint).then(response => response.json()),
//             fetch(serviceEndpoint).then(response => response.json()),
//             fetch(transactionEndpoint, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             }).then(response => response.json()),
//             fetch(customerEndpoint, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "Authorization": `Bearer ${token}`
//                 }
//             }).then(response => response.json()),
//             fetch(productEndpoint).then(response => response.json()),
//             fetch(categoryEndpoint).then(response => response.json())
//         ]);

//         // Tampilkan jumlah data di masing-masing elemen HTML
//         document.getElementById('project-sum').textContent = projects.data.length;
//         document.getElementById('service-sum').textContent = services.data.length;
//         document.getElementById('transaction-sum').textContent = transactions.data.length;
//         document.getElementById('customer-sum').textContent = customers.data.length;
//         document.getElementById('product-sum').textContent = products.data.length;
//         document.getElementById('category-sum').textContent = categories.data.length; // Mengambil jumlah kategori

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }


// async function fetchDataSum() {
//     try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             alert('Akses dibatasi');
//             return;
//         }

//         const categoryEndpoint = 'http://localhost:8081/api-putra-jaya/category/list';
        
//         const categories = await fetch(categoryEndpoint).then(response => response.json());
        
//         // Log respons API untuk kategori
//         console.log('Categories Response:', categories);
        
//         // Cek apakah elemen dengan ID "category-sum" sudah ada
//         const categorySumElement = document.getElementById('category-sum');
//         console.log('Category Sum Element:', categorySumElement);

//         if (categorySumElement) {
//             categorySumElement.textContent = categories.data.length;
//             console.log('Jumlah kategori:', categories.data.length);
//         } else {
//             console.error('Element #category-sum not found.');
//         }

//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// }


document.addEventListener('DOMContentLoaded', function() {
    fetchDataSum();
});

async function fetchDataSum() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Akses dibatasi');
            return;
        }

        const projectEndpoint = 'http://localhost:8081/api-putra-jaya/portfolio/list';
        const serviceEndpoint = 'http://localhost:8081/api-putra-jaya/service/list';
        const transactionEndpoint = 'http://localhost:8081/api-putra-jaya/transaction/transaction-owner';
        const customerEndpoint = 'http://localhost:8081/api-putra-jaya/user/list-user';
        const productEndpoint = 'http://localhost:8081/api-putra-jaya/product/list';
        const categoryEndpoint = 'http://localhost:8081/api-putra-jaya/category/list';

        // Ambil semua data sekaligus menggunakan Promise.all
        // const [projects,services,customers,products,categories] = await Promise.all([
        const [projects, services, transactions, customers, products, categories] = await Promise.all([
            fetch(projectEndpoint).then(response => response.json()),
            fetch(serviceEndpoint).then(response => response.json()),
            fetch(transactionEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()),
            // fetch(transactionEndpoint).then(response => response.json()),
            fetch(customerEndpoint, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            }).then(response => response.json()),
            fetch(productEndpoint).then(response => response.json()),
            fetch(categoryEndpoint).then(response => response.json())
        ]);

        // Log semua data untuk memastikan diterima dengan benar
        console.log('Projects:', projects);
        console.log('Services:', services);
        console.log('Transactions:', transactions);
        console.log('Customers:', customers);
        console.log('Products:', products);
        console.log('Categories:', categories);

        // Tampilkan jumlah data di masing-masing elemen h4
        document.getElementById('project-sum').textContent = projects.data.length;
        document.getElementById('service-sum').textContent = services.data.length;
        document.getElementById('transaction-sum').textContent = transactions.data.length;
        document.getElementById('customer-sum').textContent = customers.data.length;
        document.getElementById('product-sum').textContent = products.data.length;
        document.getElementById('category-sum').textContent = categories.data.length;

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
