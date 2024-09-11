(function () {
	'use strict';

	var tinyslider = function () {
		var el = document.querySelectorAll('.testimonial-slider');

		if (el.length > 0) {
			var slider = tns({
				container: '.testimonial-slider',
				items: 1,
				axis: "horizontal",
				controlsContainer: "#testimonial-nav",
				swipeAngle: false,
				speed: 700,
				nav: true,
				controls: true,
				autoplay: true,
				autoplayHoverPause: true,
				autoplayTimeout: 3500,
				autoplayButtonOutput: false
			});
		}
	};
	tinyslider();




	var sitePlusMinus = function () {

		var value,
			quantity = document.getElementsByClassName('quantity-container');

		function createBindings(quantityContainer) {
			var quantityAmount = quantityContainer.getElementsByClassName('quantity-amount')[0];
			var increase = quantityContainer.getElementsByClassName('increase')[0];
			var decrease = quantityContainer.getElementsByClassName('decrease')[0];
			increase.addEventListener('click', function (e) { increaseValue(e, quantityAmount); });
			decrease.addEventListener('click', function (e) { decreaseValue(e, quantityAmount); });
		}

		function init() {
			for (var i = 0; i < quantity.length; i++) {
				createBindings(quantity[i]);
			}
		};

		function increaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			console.log(quantityAmount, quantityAmount.value);

			value = isNaN(value) ? 0 : value;
			value++;
			quantityAmount.value = value;
		}

		function decreaseValue(event, quantityAmount) {
			value = parseInt(quantityAmount.value, 10);

			value = isNaN(value) ? 0 : value;
			if (value > 0) value--;

			quantityAmount.value = value;
		}

		init();

	};
	sitePlusMinus();


})()

// Fungsi untuk menangani logout
function logout() {
	// Tambahkan logika untuk logout, misalnya menghapus token dari local storage
	localStorage.removeItem('token');

	// Redirect ke halaman login atau home
	window.location.href = './login.html';
}

// Jika Anda ingin memastikan bahwa Bootstrap JS di-load dan dropdown berfungsi
document.addEventListener('DOMContentLoaded', () => {
	const dropdownElementList = [].slice.call(document.querySelectorAll('.dropdown-toggle'));
	const dropdownList = dropdownElementList.map(function (dropdownToggleEl) {
		return new bootstrap.Dropdown(dropdownToggleEl);
	});

	const token = localStorage.getItem('token');
	if (token != undefined && token != "") {
		document.getElementById('log-btn').style.display = 'none';
		document.getElementById('historyOrder').addEventListener('click', e => {
			location.href = './history.html';
		});
	} else if (token == undefined || token == "") {
		document.getElementById('logout-btn').style.display = 'none';

		document.getElementById('historyOrder').addEventListener('click', e => {
			location.href = './login.html';
		});
	}
});

document.getElementById('apply-coupon').addEventListener('click', function () {
	alert('Coupon WELCOME10 applied!');
	const objCoup = JSON.parse(localStorage.getItem('objCoupon'));
	localStorage.setItem('kupon', JSON.stringify(objCoup));
	document.getElementById('coupon-popup').style.display = 'none';
});

document.addEventListener('DOMContentLoaded', async function () {
	const availableCoupons = { code: 'WELLCOME10', discount: 50 };
	localStorage.setItem('objCoupon', JSON.stringify(availableCoupons));

	const kupon = JSON.parse(localStorage.getItem('kupon'));
	
	if (kupon != "" && kupon != undefined) {
		document.getElementById('coupon-popup').style.display = 'none';
	} else {
		setTimeout(function () {
			document.getElementById('coupon-popup').style.display = 'flex';
		}, 2000); // Show after 2 seconds
	}

	document.getElementById('button-addon2').addEventListener('click', function () {
		const couponCode = document.getElementById('c_code').value.trim();
		if (couponCode) {
			applyCoupon(couponCode);
		} else {
			alert('Silakan masukkan kode kupon.');
		}

	});
});