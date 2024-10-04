document.addEventListener('DOMContentLoaded', function () {
    const kupon = JSON.parse(localStorage.getItem('kupon'));
    const token = localStorage.getItem('token');
    if (kupon) {
        const couponField = document.getElementById('coupon');
        if (couponField) {
            couponField.value = kupon.code;
        } else {
            console.error('Coupon input field not found.');
        }
    }
    displayCartItems(); // Tampilkan item di cart
    updateCartTotals(); // Update subtotal dan total di halaman

    if (token != undefined && token != "") {
		document.getElementById('log-btn').style.display = 'none';
		document.getElementById('historyOrder').addEventListener('click', e => {
			location.href = './history.html';
		});
	} else if (token == undefined || token == "") {
		document.getElementById('logout-btn').style.display = 'none';

		document.getElementById('historyOrder').addEventListener('click', e => {
			location.href = './login.html';
		});
		
	}
});

// Fungsi untuk menampilkan item di cart
function displayCartItems() {

    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-items');

    if (!tbody) {
        console.error('Element with ID "cart-items" not found.');
        return;
    }
    
    tbody.innerHTML = ''; // Kosongkan isi sebelumnya

    cart.forEach(prod => {

        const row = document.createElement('tr');
        // Kolom gambar produk
        const imgTd = document.createElement('td');
        imgTd.classList.add('product-thumbnail');
        const img = document.createElement('img');
        img.src = `../server/${prod.photos}`; // Path ke gambar produk
        img.alt = prod.name;
        img.classList.add('img-fluid');
        imgTd.appendChild(img);

        // Kolom nama produk
        const nameTd = document.createElement('td');
        nameTd.classList.add('product-name');
        const productName = document.createElement('h2');
        productName.classList.add('h5', 'text-black');
        productName.textContent = prod.name;
        nameTd.appendChild(productName);

        // Kolom harga produk
        const priceTd = document.createElement('td');
        priceTd.textContent = formatIDR(prod.price);

        // Kolom kuantitas produk
        const qtyTd = document.createElement('td');
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('input-group', 'mb-3', 'd-flex', 'align-items-center', 'quantity-container');
        quantityContainer.style.maxWidth = '120px';

        const decreaseBtn = document.createElement('button');
        decreaseBtn.classList.add('btn', 'btn-outline-black', 'decrease');
        decreaseBtn.textContent = '−';
        decreaseBtn.onclick = () => updateQuantity(prod.id, -1);

        const qtyInput = document.createElement('input');
        qtyInput.type = 'text';
        qtyInput.classList.add('form-control', 'text-center', 'quantity-amount');
        qtyInput.value = prod.quantity;

        const increaseBtn = document.createElement('button');
        increaseBtn.classList.add('btn', 'btn-outline-black', 'increase');
        increaseBtn.textContent = '+';
        increaseBtn.onclick = () => updateQuantity(prod.id, 1);

        quantityContainer.appendChild(decreaseBtn);
        quantityContainer.appendChild(qtyInput);
        quantityContainer.appendChild(increaseBtn);
        qtyTd.appendChild(quantityContainer);

        // Kolom total harga per produk
        const totalTd = document.createElement('td');
        totalTd.textContent = formatIDR(prod.price * prod.quantity);

        // Kolom hapus produk
        const removeTd = document.createElement('td');
        const removeBtn = document.createElement('a');
        removeBtn.href = '#';
        removeBtn.classList.add('btn', 'btn-black', 'btn-sm');
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => removeProductFromCart(prod.id);

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

// Fungsi untuk update quantity produk
function updateQuantity(productId, delta) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const productIndex = cart.findIndex(item => item.id === productId);

    if (productIndex >= 0) {
        cart[productIndex].quantity += delta;

        if (cart[productIndex].quantity <= 0) {
            cart.splice(productIndex, 1); // Hapus produk jika quantity 0
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems(); // Update tampilan cart
        discountCheck(); // Cek diskon ulang
        updateCartTotals(); // Update subtotal dan total
    }
}

// Fungsi untuk hapus produk dari cart
function removeProductFromCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.id !== productId); // Hapus produk dari cart
    localStorage.setItem('cart', JSON.stringify(cart));

    discountCheck(); // Cek diskon ulang
    displayCartItems(); // Update tampilan cart
    updateCartTotals(); // Update subtotal dan total
}

// Fungsi untuk mengaplikasikan kupon
document.getElementById('apply').addEventListener('click', async function applyCoupon() {
    const token = localStorage.getItem('token');
    const kupon = JSON.parse(localStorage.getItem('kupon'));

    try {
        localStorage.removeItem('cartNew');
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
        const cart = JSON.parse(localStorage.getItem('cart'));
        const cartNew = JSON.parse(JSON.stringify(cart)); // Deep copy cart

        if (data.data != null) {
            data.data.forEach(res => {
                if (kupon.code == res) {
                    throw new Error('This coupon has already been used.');
                }
            });
            discountCheck();
        } else {
            discountCheck();      
        }
    } catch (error) {
        alert(error.message);
    }
})

// Fungsi untuk cek dan hitung diskon
function discountCheck() {
    const kupon = JSON.parse(localStorage.getItem('kupon'));
    if (!kupon) return;

    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartNew = JSON.parse(JSON.stringify(cart)); // Deep copy cart

    let discount = 0;
    cartNew.forEach((product, index) => {
        const price = parseFloat(product.price) || 0;
        const quantity = parseInt(product.quantity) || 1;
        discount += (price * quantity) * (kupon.discount / 100);
        localStorage.setItem(`discount${index + 1}`, (price * quantity) * (kupon.discount / 100));
    });

    localStorage.setItem('discountTotal', discount);
    updateCartTotals(); // Update total keranjang
}

// Fungsi untuk update subtotal dan total
function updateCartTotals() {
    let cart = JSON.parse(localStorage.getItem('cartNew')) || [];
    if (cart.length < 1) {
        cart = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    const discount = localStorage.getItem('discountTotal');
    const subtotalElem = document.getElementById('subtotal');
    const totalElem = document.getElementById('total');
    console.log(discount);
    
    if (!subtotalElem || !totalElem) {
        console.error('Subtotal or Total element not found.');
        return;
    }

    const subtotal = cart.reduce((acc, product) => acc + (product.price * product.quantity), 0);
    const total = subtotal-discount;

    subtotalElem.textContent = formatIDR(subtotal); // Tampilkan subtotal dalam format Rupiah
    totalElem.textContent = formatIDR(total); // Tampilkan total dalam format Rupiah
}

// Fungsi format IDR
function formatIDR(amount) {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}







