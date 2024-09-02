document.addEventListener('DOMContentLoaded', function() {
    fetch('http://localhost:8081/api-putra-jaya/product/list')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            displayProducts(data.data); 
            updateCartCount(); 
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
        console.log(product);
        
        const productImage = document.createElement('img');
        productImage.src = "../../server/"+product.photos; 
        productCard.appendChild(productImage);

        const productName = document.createElement('h3');
        productName.textContent = product.name; 
        productCard.appendChild(productName);
        console.log("This Prod :",products);

        // const productDescription = document.createElement('p');
        // productDescription.textContent = product.description; // Menyesuaikan properti `description` sesuai dengan data
        // productCard.appendChild(productDescription);

        const productPrice = document.createElement('p');
        productPrice.textContent = `${product.price}`; // Menampilkan harga produk
        productCard.appendChild(productPrice);

        // const productStock = document.createElement('p');
        // productStock.textContent = `Stock: ${product.stock}`; // Menampilkan stok produk
        // productCard.appendChild(productStock);

        const addToCartButton = document.createElement('button');
        addToCartButton.innerHTML = '<i class="bi bi-cart-plus-fill"></i>';
        addToCartButton.className = 'add-to-cart-btn';
        addToCartButton.onclick = () => {
            addToCart(product);
            updateCartCount();
        };

        const detail = document.createElement('button');
        detail.innerHTML = 'Detail';
        detail.className = 'detail-btn';
        detail.onclick = () => {
            window.location.href = "detailproduk.html"; // Perbaiki link ke "detail.html"
        };

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'button-container';

        buttonContainer.appendChild(addToCartButton);
        buttonContainer.appendChild(detail);

        productCard.appendChild(buttonContainer);
        productContainer.appendChild(productCard);

            });
}

function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
    console.log("This cart 2:",cart);
    console.log("This Prod 3:",product);
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
