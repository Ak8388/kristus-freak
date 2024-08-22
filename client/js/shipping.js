async function handleFormSubmit(event) {
    event.preventDefault();
    const token = localStorage.getItem('token');

    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const phone = document.getElementById('phone').value;
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const sc = localStorage.getItem('shipping-cost');
    let totalAmount = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
    console.log(sc);
    totalAmount += parseInt(sc);
    console.log(totalAmount);
    const addressFix = document.getElementById('province').value + document.getElementById('city').value + address;
    console.log(cart);

    const items = cart.map(product => ({
        id: parseInt(product.id),
        name: product.produk_dto.name,
        price: parseInt(product.price),
        quantity: parseInt(product.quantity),
        shipingCost: parseInt(sc),
        type_product: "1", // Sesuaikan jika ada informasi yang lebih spesifik
        note: "notes product" // Sesuaikan jika ada catatan khusus
    }));
    items.push({
        name: 'shipping cost',
        price: parseInt(sc),
        quantity: 1,
        shipingCost: 0,
        type_product: "1", // Sesuaikan jika ada informasi yang lebih spesifik
        note: "notes product"
    })
    const cusDetail = {
        id: 0,
        shipping_address: addressFix,
    }

    const transDetail = {
        order_id: "",
        gross_amount: totalAmount,
    }

    await fetch('http://localhost:8081/api-putra-jaya/transaction/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json', "Authorization": "Bearer " + token
        },
        body: JSON.stringify({ 'transaction_details': transDetail, 'item_details': items, 'customer_details': cusDetail })
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            // window.location.href = data.redirectUrl;
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

                            city.addEventListener('change', async a => {
                                console.log(city.value);
                                const cart = JSON.parse(localStorage.getItem('cart')) || [];
                                let sum = 0;

                                cart.map(total => {
                                    sum += (total.weight * total.quantity);
                                })

                                console.log(sum);

                                const objReq = {
                                    origin: "103",
                                    destination: city.value,
                                    weight: sum,
                                    courier: "jne"
                                }

                                try {
                                    await fetch('http://localhost:8081/api-putra-jaya/delivery/cost-delivery', {
                                        method: "POST",
                                        body: JSON.stringify(objReq),
                                        headers: {
                                            "Authorization": "Bearer " + token
                                        }
                                    })
                                        .then(result => {
                                            if (!result.ok) {
                                                throw new Error('err');
                                            } else {
                                                return result.json();
                                            }
                                        })
                                        .then(resData => {
                                            localStorage.setItem('shipping-cost', resData.data.rajaongkir.results[0].costs[0].cost[0].value);
                                            document.getElementById('cost-text').textContent = resData.data.rajaongkir.results[0].costs[0].cost[0].value;
                                        })
                                } catch (err) {

                                }
                            })

                        })
                })
            })
    } catch (error) {
        alert('internal server error');
    }
})