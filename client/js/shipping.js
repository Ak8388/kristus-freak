async function handleFormSubmit(event) {
    event.preventDefault();

    const token = localStorage.getItem('token');
    try {
        await fetch('http://localhost:8081/api-putra-jaya/transaction/valid', {
            headers: { "Authorization": "Bearer " + token },
            method: "POST"
        })
            .then(res => {
                if (!res.ok) {
                    throw new Error('error');
                } else {
                    return res.json();
                }
            })
            .then(resData => {
                console.log(resData);
            })

        const name = document.getElementById('name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const postCode = document.getElementById('post-code').value;
        const kupon = JSON.parse(localStorage.getItem('kupon'));

        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        let index = 1;
        
        const sc = localStorage.getItem('shipping-cost');
        let totalAmount = cart.reduce((total, product) => total + (product.price * product.quantity), 0);
        totalAmount += parseInt(sc);
        const addressFix = document.getElementById('province').value + document.getElementById('city').value + address;
        const cartL = JSON.parse(localStorage.getItem('cart'));
        console.log("this cartL :", cartL);

        const items = cart.map(product => ({
            'id': parseInt(product.id),
            'name': product.name,
            'price': parseInt(product.price),
            'quantity': parseInt(product.quantity),
            'shipingCost': parseInt(sc),
            'type_product': "1", // Sesuaikan jika ada informasi yang lebih spesifik
            'note': "notes product" // Sesuaikan jika ada catatan khusus
        }));

        items.push({
            'name': 'shipping cost',
            'price': parseInt(sc),
            'quantity': 1,
            'shipingCost': 0,
            'type_product': "1", // Sesuaikan jika ada informasi yang lebih spesifik
            'note': "notes product"
        })

        const cusDetail = {
            'id': 0,
            'name': name,
            'phoneNumber': phone,
            'shipping_address': addressFix,
            'postCode': postCode
        }
        
        const transDetail = {
            'order_id': "",
            'gross_amount': totalAmount,
        }

        await fetch('http://localhost:8081/api-putra-jaya/transaction/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ 'transaction_details': transDetail, 'item_details': items, 'customer_details': cusDetail })
        })
            .then(response => response.json())
            .then(async data => {
                const response = await fetch('http://localhost:8081/api-putra-jaya/coupon', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body:JSON.stringify(kupon),
                });
        
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
        
                const dat = await response.json();        

                index = 1;
                cart.map(e => {
                    localStorage.removeItem(`discount${index}`)
                    index++
                })
                localStorage.removeItem('kupon');
                localStorage.removeItem('discount');
                localStorage.removeItem('cart');
                localStorage.setItem('redirectUrl', data.data.redirect_url);
                window.location.href = data.data.redirect_url;
            })
            .catch(error => console.error('Error:', error));
    } catch (err) {
        console.log(err);
    }

}

document.addEventListener('DOMContentLoaded', async e => {
    const token = localStorage.getItem('token');

    try {
        // Fetch provinces
        const responseProvince = await fetch('http://localhost:8081/api-putra-jaya/delivery/province', {
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        if (!responseProvince.ok) throw new Error('Failed to fetch provinces');

        const resData = await responseProvince.json();
        const prov = document.getElementById('province');
        const optionProv1 = document.createElement('option');
        optionProv1.value = "";
        optionProv1.innerText = "Select Provinces";
        prov.append(optionProv1);

        resData.data.rajaongkir.results.forEach(res => {
            const optionName = document.createElement('option');
            optionName.value = res.province_id;
            optionName.innerText = res.province;
            prov.appendChild(optionName);
        });

        // Event listener for province selection
        prov.addEventListener('change', async () => {
            try {
                const responseCity = await fetch(`http://localhost:8081/api-putra-jaya/delivery/city/${prov.value}`, {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });

                if (!responseCity.ok) throw new Error('Failed to fetch cities');

                const resCityData = await responseCity.json();
                const city = document.getElementById('city');
                city.removeAttribute('disabled');
                city.innerHTML = "";

                const cityOpt1 = document.createElement('option');
                cityOpt1.value = "";
                cityOpt1.innerText = "Select City";
                city.appendChild(cityOpt1);

                resCityData.data.rajaongkir.results.forEach(resCity => {
                    const optionName = document.createElement('option');
                    optionName.value = resCity.city_id;
                    optionName.innerText = resCity.city_name;
                    city.appendChild(optionName);
                });

                // Event listener for city selection
                city.addEventListener('change', async () => {
                    const cart = JSON.parse(localStorage.getItem('cartFix')) || [];
                    let sum = 0;

                    cart.forEach(total => {
                        sum += (total.weight * total.quantity);
                    });

                    const objReq = {
                        origin: "103",  // Origin city ID (should be dynamically set if necessary)
                        destination: city.value,
                        weight: sum,
                        courier: "jne"
                    };

                    try {
                        const responseCost = await fetch('http://localhost:8081/api-putra-jaya/delivery/cost-delivery', {
                            method: "POST",
                            body: JSON.stringify(objReq),
                            headers: {
                                "Authorization": "Bearer " + token,
                                "Content-Type": "application/json"
                            }
                        });

                        if (!responseCost.ok) throw new Error('Failed to fetch shipping cost');

                        const resCostData = await responseCost.json();
                        const shippingCost = resCostData.data.rajaongkir.results[0].costs[0].cost[0].value;
                        localStorage.setItem('shipping-cost', shippingCost);
                        document.getElementById('cost-text').textContent = shippingCost;

                    } catch (err) {
                        console.error('Error:', err);
                    }
                });

            } catch (error) {
                console.error('Error:', error);
                alert('Failed to load cities');
            }
        });

    } catch (error) {
        alert('Internal server error');
    }

    // Event listener for the Place Order button
    document.getElementById('place-order-btn').addEventListener('click', handleFormSubmit);
});




// !!!! //
