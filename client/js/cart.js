document.addEventListener('DOMContentLoaded', function () {
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
        img.src = `${product.photos}`; // Path ke gambar produk
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
        updateCartTotals(); // Update subtotal dan total
    }
}

// Fungsi untuk hapus produk dari cart
function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); // Hapus produk dari cart
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems(); // Update tampilan
    updateCartTotals(); // Update subtotal dan total
}

// Fungsi untuk update subtotal dan total
function updateCartTotals() {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const subtotalElem = document.getElementById('subtotal');
    const totalElem = document.getElementById('total');

    const subtotal = cart.reduce((acc,product) => acc + (product.price * product.quantity), 0);
    const total = subtotal;

    subtotalElem.textContent = formatIDR(subtotal);
    totalElem.textContent = formatIDR(total);
}
