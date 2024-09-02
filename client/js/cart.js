document.addEventListener('DOMContentLoaded', () => {
    const cartContainer = document.getElementById('cart-container');
    const summaryContainer = document.getElementById('summary-container');


    if (!summaryContainer) {
        console.error('Elemen dengan ID "summary-container" tidak ditemukan.');
        return;
    }

    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCart() {
        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Keranjang belanja kosong</p>';
            checkoutButton.disabled = true;
            summaryContainer.innerHTML = '';
        } else {
            cartContainer.innerHTML = '';
            cart.forEach((product, index) => {
                const subtotal = product.price * product.quantity;
                console.log(product);
                
                const productDiv = document.createElement('div');
                productDiv.classList.add('cart-item');
                productDiv.innerHTML = `
                    <input type="checkbox" class="product-checkbox" id="product-${index}" onchange="updateSummary()" />
                    <div class="product-details">
                        <img src="../../server/${product.photos}" alt="${product.name}" class="product-image">
                        <div class="details-content">
                            <p><strong>${product.name}</strong></p>
                            <p>Harga: Rp${product.price}</p>
                            <div class="quantity-control">
                                <button class="quantity-btn" onclick="changeQuantity(${index}, -1)">-</button>
                                <span class="quantity">${product.quantity}</span>
                                <button class="quantity-btn" onclick="changeQuantity(${index}, 1)">+</button>
                            </div>
                            <p>Subtotal: Rp${subtotal}</p>
                        </div>
                    </div>
                `;
                cartContainer.appendChild(productDiv);
            });
            checkoutButton.disabled = false;
            updateSummary();
        }
    }

    window.changeQuantity = function(index, change) {
        if (cart[index]) {
            const newQuantity = cart[index].quantity + change;
            
            if (newQuantity < 1) {
                const confirmDelete = confirm(' Apakah Anda ingin menghapus produk ini ?');
                if (confirmDelete) {
                    cart.splice(index, 1); // Hapus produk dari array keranjang
                }
            } else {
                cart[index].quantity = newQuantity;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            displayCart();
        }
    };

    window.updateSummary = function() {
        let totalQuantity = 0;
        let totalPrice = 0;
        let datacheck = []
        cart.forEach((product, index) => {
            if (document.getElementById(`product-${index}`).checked) {
                totalQuantity += product.quantity;
                totalPrice += product.price * product.quantity;
                const data = {'id':product.id,'description':product.description,'id_category':product.id_category,'name':product.name,'photos':product.photos,'price':product.price,'quantity':product.quantity,'stock':product.stock, 'weight':product.weight}
                datacheck.push(data);
            }
        });
        
        localStorage.setItem('cartFix',JSON.stringify(datacheck));
        
        summaryContainer.innerHTML = `
            <h3>Total Produk: ${totalQuantity}</h3>
            <h3>Subtotal: Rp${totalPrice}</h3>
            <button id="checkout-button" class="checkout-btn">Checkout</button>
        `;

        document.getElementById('checkout-button').addEventListener('click', () => {
            if (totalQuantity > 0) {
                const selectedProducts = cart.filter((_, index) => 
                    document.getElementById(`product-${index}`).checked
                );
                localStorage.setItem('selectedCart', JSON.stringify(selectedProducts));
                window.location.href = 'shipping.html';
            } else {
                alert('Silakan pilih setidaknya satu produk untuk di-checkout.');
            }
        });
    };

    displayCart();
});
