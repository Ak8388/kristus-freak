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

function formatIDR(amount) {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function displayProducts(products) {
    if (!Array.isArray(products)) {
        console.error('Expected an array but got:', products);
        return;
    }

    const container = document.querySelector('.product-list'); // Assume you have a container with class 'product-list'
    container.innerHTML = ''; // Clear any existing content

    products.forEach(product => {
        // Create the product card container
        const productCard = document.createElement('div');
        productCard.classList.add('col-12', 'col-md-4', 'col-lg-3', 'mb-5');

        const productItem = document.createElement('a');
        productItem.classList.add('product-item');
        productItem.href = "#";

        // Create the container for the image
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        // Create the product image
        const productImage = document.createElement('img');
        productImage.src = "../server/" + product.photos;
        productImage.classList.add('img-fluid', 'product-thumbnail');
        productContainer.appendChild(productImage);

        // Append productContainer to productItem
        productItem.appendChild(productContainer);

        // Create and append the product title
        const productName = document.createElement('h3');
        productName.textContent = product.name;
        productName.classList.add('product-title');
        productItem.appendChild(productName);

        // Create and append the product price
        const productPrice = document.createElement('strong');
        productPrice.textContent = formatIDR(product.price);
        productPrice.classList.add('product-price');
        productItem.appendChild(productPrice);

        // Create and append the cross icon
        const iconCross = document.createElement('span');
        iconCross.classList.add('icon-cross');

        const crossImage = document.createElement('img');
        crossImage.src = 'images/cross.svg';
        crossImage.classList.add('img-fluid');
        iconCross.appendChild(crossImage);

        iconCross.addEventListener('click', () => {
            addToCart(product);
        });

        productItem.appendChild(iconCross);

        // Append the product item to the product card
        productCard.appendChild(productItem);

        // Append the product card to the container
        container.appendChild(productCard);
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
    updateCartCount(); // Pastikan cart count ter-update setelah penambahan
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((count, product) => count + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}
