function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalAmount = cart.reduce((total, product) => total + (product.price * product.quantity), 0);

    const items = cart.map(product => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: product.quantity,
        type_product: "1", // Sesuaikan jika ada informasi yang lebih spesifik
        note: "notes product" // Sesuaikan jika ada catatan khusus
    }));

    fetch('http://localhost:8081/api-putra-jaya/transaction/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, address, phone, totalAmount, items })
    })
    .then(response => response.json())
    .then(data => {
        window.location.href = data.redirectUrl;
    })
    .catch(error => console.error('Error:', error));
}
