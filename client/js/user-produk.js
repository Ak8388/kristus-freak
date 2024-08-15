document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8081/api-putra-jaya/detail/list')
        .then(response => response.json())
        .then(data => {
            console.log(data); // Melihat data dari response
            displayProducts(data.data); // Mengakses array `data` dari response
            updateCartCount(); // Mengupdate jumlah item di keranjang saat halaman dimuat
        })
        .catch(error => console.error('Error fetching data:', error));
});

function displayProducts(products) {
    if (!Array.isArray(products)) {
        console.error('Expected an array but got:', products);
        return;
    }

    const productContainer = document.getElementById('product-container');
    productContainer.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('card');

        const productImage = document.createElement('img');
        productImage.src = product.photos; // Menyesuaikan properti `photos` sesuai dengan data
        productCard.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.textContent = product.produk_dto.name; // Menyesuaikan properti `name` sesuai dengan data
        productCard.appendChild(productName);

        const productDescription = document.createElement('p');
        productDescription.textContent = product.description; // Menyesuaikan properti `description` sesuai dengan data
        productCard.appendChild(productDescription);

        const productPrice = document.createElement('p');
        productPrice.textContent = `Price: ${product.price}`; // Menampilkan harga produk
        productCard.appendChild(productPrice);

        const productStock = document.createElement('p');
        productStock.textContent = `Stock: ${product.stock}`; // Menampilkan stok produk
        productCard.appendChild(productStock);

        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Tambah ke Keranjang';
        addToCartButton.onclick = () => {
            addToCart(product);
            updateCartCount();
        };
        productCard.appendChild(addToCartButton);

        productContainer.appendChild(productCard);
    });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);

    if (existingProductIndex >= 0) {
        cart[existingProductIndex].quantity += 1;
    } else {
        product.quantity = 1;
        cart.push(product);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    alert('Produk telah ditambahkan ke keranjang');
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((count, product) => count + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}
