document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const checkoutButton = document.getElementById('checkout-button');

    // Memuat data keranjang dari localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Fungsi untuk menampilkan data keranjang di halaman
    function displayCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Keranjang belanja kosong</p>';
            checkoutButton.disabled = true; // Disable checkout button if cart is empty
        } else {
            cartContainer.innerHTML = '';
            cart.forEach((product, index) => {
                const productDiv = document.createElement('div');
                productDiv.classList.add('cart-item');
                productDiv.innerHTML = `
                    <p>${product.name}</p>
                    <p>Harga: Rp${product.price}</p>
                    <p>Jumlah: ${product.quantity}</p>
                `;
                cartContainer.appendChild(productDiv);
            });
            checkoutButton.disabled = false; // Enable checkout button if cart is not empty
        }
    }

    // Mengarahkan ke halaman shipping ketika tombol checkout diklik
    checkoutButton.addEventListener('click', () => {
        if (cart.length > 0) {
            window.location.href = 'shipping.html';
        } else {
            alert('Keranjang belanja Anda kosong. Silakan tambahkan produk terlebih dahulu.');
        }
    });

    // Menampilkan data keranjang ketika halaman dimuat
    displayCart();
});
