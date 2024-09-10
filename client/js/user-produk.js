document.addEventListener('DOMContentLoaded', function () {
    displayProducts("")
    updateCartCount();
});

function formatIDR(amount) {
    return amount.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
}

function category(id){
    displayProducts(id)
}

function displayProducts(id) {
    fetch('http://localhost:8081/api-putra-jaya/product/list')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (!Array.isArray(data.data)) {
                console.error('Expected an array but got:', data.data);
                return;
            }

            const container = document.querySelector('.product-list'); // Assume you have a container with class 'product-list'
            container.innerHTML = ''; // Clear any existing content

            data.data.forEach(product => {
                if (id != "") {
                    if (id == product.id_category) {
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

                        // Create a container for the cross icon and view detail button
                        const actionContainer = document.createElement('div');
                        actionContainer.classList.add('action-container');

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

                        // Append the cross icon to the action container
                        actionContainer.appendChild(iconCross);

                        // Create and append the "View Detail" button
                        const viewDetailButton = document.createElement('button');
                        viewDetailButton.classList.add('btn', 'btn-primary'); // Tambahkan class CSS
                        viewDetailButton.textContent = 'View Detail';


                        viewDetailButton.addEventListener('click', () => {
                            viewProductDetail(product.id);
                        });

                        // Append the view detail button to the action container
                        actionContainer.appendChild(viewDetailButton);

                        // Append the action container to the product item
                        productItem.appendChild(actionContainer);

                        // Append the product item to the product card
                        productCard.appendChild(productItem);

                        // Append the product card to the container
                        container.appendChild(productCard);
                    }
                } else {
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

                    // Create a container for the cross icon and view detail button
                    const actionContainer = document.createElement('div');
                    actionContainer.classList.add('action-container');

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

                    // Append the cross icon to the action container
                    actionContainer.appendChild(iconCross);

                    // Create and append the "View Detail" button
                    const viewDetailButton = document.createElement('button');
                    viewDetailButton.classList.add('btn', 'btn-primary'); // Tambahkan class CSS
                    viewDetailButton.textContent = 'View Detail';


                    viewDetailButton.addEventListener('click', () => {
                        viewProductDetail(product.id);
                    });

                    // Append the view detail button to the action container
                    actionContainer.appendChild(viewDetailButton);

                    // Append the action container to the product item
                    productItem.appendChild(actionContainer);

                    // Append the product item to the product card
                    productCard.appendChild(productItem);

                    // Append the product card to the container
                    container.appendChild(productCard);
                }

            });
        })
        .catch(error => console.error('Error fetching data:', error));


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
    window.location.href = "shop.html";
}


function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((count, product) => count + product.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

// Fungsi untuk menampilkan modal detail produk
function viewProductDetail(productId) {
    fetch(`http://localhost:8081/api-putra-jaya/product/${productId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch product data');
            }
            return response.json();
        })
        .then(product => {
            // Isi data modal dengan detail produk
            document.getElementById('modal-image').src = "../server/" + product.data.photos; // Asumsi produk punya properti 'image'
            document.getElementById('modal-name').textContent = product.data.name; // Asumsi produk punya properti 'name'
            document.getElementById('modal-price').textContent = formatIDR(product.data.price); // Asumsi produk punya properti 'name'
            document.getElementById('modal-description').textContent = product.data.description; // Asumsi produk punya properti 'description'

            // Tampilkan modal
            document.getElementById('modal-container').style.display = 'block';
            const addToCartButton = document.getElementById('add-cart-button');
            addToCartButton.onclick = () => {
                addToCart(product);  // Panggil fungsi addToCart dengan produk yang relevan

            };
        })
        .catch(error => console.error('Error fetching product:', error));

}

// Event listener untuk menutup modal jika klik di luar modal
window.addEventListener('click', function (event) {
    const modalContainer = document.getElementById('modal-container');
    if (event.target == modalContainer) {
        modalContainer.style.display = 'none';
    }
});

