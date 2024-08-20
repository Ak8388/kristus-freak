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

document.addEventListener('DOMContentLoaded', async e => {
    const token = localStorage.getItem('token');
    try {
        await fetch('http://localhost:8081/api-putra-jaya/delivery/province', {
            headers: {
                "Authorization": "Bearer " + token
            }
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                const prov = document.getElementById('province');
                const optionProv1 = document.createElement('option');
                optionProv1.value = "";
                optionProv1.innerText = "Select Provinces";
                prov.append(optionProv1);

                resData.data.rajaongkir.results.map(res => {
                    const optionName = document.createElement('option');
                    optionName.value = res.province_id;
                    optionName.innerText = res.province;

                    prov.appendChild(optionName);
                })

                prov.addEventListener('change', async (e) => {
                    await fetch(`http://localhost:8081/api-putra-jaya/delivery/city/${prov.value}`, {
                        headers: {
                            "Authorization": "Bearer " + token
                        }
                    })
                        .then(res => {
                            if (!res.ok) {
                                throw new Error('error');
                            } else {
                                return res.json();
                            }
                        })
                        .then(res => {
                            const city = document.getElementById('city');
                            city.removeAttribute('disabled');
                            city.innerHTML = "";

                            const cityOpt1 = document.createElement('option');
                            cityOpt1.value = "";
                            cityOpt1.innerText = "Select City";
                            city.append(cityOpt1);

                            res.data.rajaongkir.results.map(resCity => {
                                const optionName = document.createElement('option');
                                optionName.value = resCity.city_id;
                                optionName.innerText = resCity.city_name;
                                
                                city.appendChild(optionName);
                            })

                        })
                })
            })
    } catch (error) {
        alert('internal server error');
    }
})