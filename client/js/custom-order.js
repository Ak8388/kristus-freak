document.getElementById('custom-order-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const materialElement = document.getElementById('material');
    const sizesElement = document.getElementById('sizes');
    const photosInputElement = document.getElementById('photos');
    const qtyElement = document.getElementById('qty');
    const notesElement = document.getElementById('notes');
    const estimateWorkmanshipElement = document.getElementById('estimateWorkmanship');
    const addressShippingElement = document.getElementById('addressShipping');

    if (!materialElement || !sizesElement || !photosInputElement || !qtyElement || !notesElement || !estimateWorkmanshipElement || !addressShippingElement) {
        console.error('One or more form elements are missing');
        return;
    }

    const material = materialElement.value;
    const sizes = sizesElement.value;
    const photos = photosInputElement.files.length > 0 ? photosInputElement.files[0].name : '';
    const qty = qtyElement.value;
    const notes = notesElement.value;
    const estimateWorkmanship = estimateWorkmanshipElement.value;
    const addressShipping = addressShippingElement.value;

    fetch('http://localhost:8081/api-putra-jaya/custom-order/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            category_name:1, // Default value
            material: material,
            sizes: sizes,
            photos: photos,
            qty: parseInt(qty, 10),
            note: notes,
            id_status: 1, // Default value
            estimate_workmanship: parseInt(estimateWorkmanship, 10),
            address_shipping: addressShipping
        })
    })
    .then(response => {
        if (response.ok) { // Check if the response status is 200-299
            return response.json();
        } else {
            throw new Error('Failed to send order');
        }
    })
    .then(data => {
        console.log('Response from server:', data); // Log full response for debugging
        alert('Order sent successfully!');
        document.getElementById('custom-order-form').reset();
        window.location.href='index.html'; // Reset the form after successful submission
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to send order. Please try again.');
    });
});
