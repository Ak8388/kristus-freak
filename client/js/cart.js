document.addEventListener('DOMContentLoaded', function () {
    const kupon = JSON.parse(localStorage.getItem('kupon'));
    document.getElementById('coupon').value = kupon.code;
    displayCartItems(); // Panggil fungsi untuk menampilkan item di cart
    updateCartTotals(); // Update subtotal dan total di halaman
});

function formatIDR(amount) {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}


function displayCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-items');
    tbody.innerHTML = ''; // Kosongkan isi sebelumnya
    if (!tbody) {
        console.error('Element with ID "cart-items" not found.');
        return; // pastikan elemen ada sebelum memanipulasinya
    }
    tbody.innerHTML = ''; // Bersihkan isi sebelumnya

    cart.forEach(product => {
        const row = document.createElement('tr');

        // Kolom gambar produk
        const imgTd = document.createElement('td');
        imgTd.classList.add('product-thumbnail');
        const img = document.createElement('img');
        img.src = `../server/${product.photos}`; // Path ke gambar produk
        img.alt = product.name;
        img.classList.add('img-fluid');
        imgTd.appendChild(img);

        // Kolom nama produk
        const nameTd = document.createElement('td');
        nameTd.classList.add('product-name');
        const productName = document.createElement('h2');
        productName.classList.add('h5', 'text-black');
        productName.textContent = product.name;
        nameTd.appendChild(productName);

        // Kolom harga produk
        const priceTd = document.createElement('td');
        priceTd.textContent = formatIDR(product.price);

        // Kolom kuantitas produk
        const qtyTd = document.createElement('td');
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('input-group', 'mb-3', 'd-flex', 'align-items-center', 'quantity-container');
        quantityContainer.style.maxWidth = '120px';
        const decreaseBtn = document.createElement('button');
        decreaseBtn.classList.add('btn', 'btn-outline-black', 'decrease');
        decreaseBtn.textContent = '−';
        decreaseBtn.onclick = () => {
            updateQuantity(product.id, -1);
        };
        const qtyInput = document.createElement('input');
        qtyInput.type = 'text';
        qtyInput.classList.add('form-control', 'text-center', 'quantity-amount');
        qtyInput.value = product.quantity;
        const increaseBtn = document.createElement('button');
        increaseBtn.classList.add('btn', 'btn-outline-black', 'increase');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => {
            updateQuantity(product.id, 1);
        };
        quantityContainer.appendChild(decreaseBtn);
        quantityContainer.appendChild(qtyInput);
        quantityContainer.appendChild(increaseBtn);
        qtyTd.appendChild(quantityContainer);

        // Kolom total harga per produk
        const totalTd = document.createElement('td');
        totalTd.textContent = formatIDR(product.price * product.quantity);

        // Kolom hapus produk
        const removeTd = document.createElement('td');
        const removeBtn = document.createElement('a');
        removeBtn.href = '#';
        removeBtn.classList.add('btn', 'btn-black', 'btn-sm');
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => {
            removeProductFromCart(product.id);
        };
        removeTd.appendChild(removeBtn);

        // Tambahkan elemen ke baris
        row.appendChild(imgTd);
        row.appendChild(nameTd);
        row.appendChild(priceTd);
        row.appendChild(qtyTd);
        row.appendChild(totalTd);
        row.appendChild(removeTd);

        tbody.appendChild(row); // Tambahkan baris ke tabel
    });
}

// Fungsi untuk update quantity
function updateQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);
    if (productIndex >= 0) {
        cart[productIndex].quantity += delta;
        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); // Hapus jika quantity 0
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); // Update tampilan
        discountCheck();   
        updateCartTotals(); // Update subtotal dan total
    }
}

// Fungsi untuk hapus produk dari cart
function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); // Hapus produk dari cart
    localStorage.setItem('cart', JSON.stringify(cart));
    discountCheck();
    displayCartItems(); // Update tampilan
    updateCartTotals(); // Update subtotal dan total
}

document.getElementById('apply').addEventListener('click', async e => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8081/api-putra-jaya/coupon', {
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

        if (data.data != null) {
            // Tindakan jika ada data kupon yang valid
        } else {
            discountCheck();
        }

    } catch (error) {
        alert(error);
    }
});

function discountCheck(){
    const kupon = JSON.parse(localStorage.getItem('kupon'));
    const cart = JSON.parse(localStorage.getItem('cart'));

    // Deep copy cart untuk cartNew agar tidak mengubah cart asli
    const cartNew = JSON.parse(JSON.stringify(cart)); // Deep copy
            
    let discount = 0;
    let index = 1;
    cartNew.map(e => {
        // Pastikan price dan quantity adalah angka yang valid
        const price = parseFloat(e.price) || 0; // Jika undefined, set ke 0
        const quantity = parseInt(e.quantity) || 1; // Jika undefined, set ke 1
        
        discount += (price * quantity) * (kupon.discount / 100);
        localStorage.setItem(`discount${index}`,(price * quantity) * (kupon.discount / 100));
        index++
    });

    localStorage.setItem('discountTotal',discount);
    console.log(discount);
    updateCartTotals(); // Update total keranjang
}


// Fungsi untuk update subtotal dan total
function updateCartTotals() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const diskon = localStorage.getItem('discountTotal');
    const subtotalElem = document.getElementById('subtotal');
    const totalElem = document.getElementById('total');

    const subtotal = cart.reduce((acc,product) => acc + (product.price * product.quantity), 0);
    const total = subtotal-parseFloat(diskon);

    subtotalElem.textContent = formatIDR(subtotal);
    totalElem.textContent = formatIDR(total);
}
