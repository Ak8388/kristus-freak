const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

document.addEventListener('DOMContentLoaded',e=>{
    localStorage.setItem('token',"");
})

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});

document.getElementById('loginForm').addEventListener('submit', function(event){
    event.preventDefault();

    const email = document.getElementById('inputEmail').value;
    const password = document.getElementById('inputPassword').value;

    const obj = {
        'email': email,
        'password': password
    };

    fetch('http://localhost:8081/api-putra-jaya/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })
    .then(response => response.json())
    .then(data => {
        const token = data.data.token_access;
        const role = data.role;
        console.log(data);
        console.log(token);
        localStorage.setItem('token', token);
        localStorage.setItem('role', role);

        if (role === "OWNER") {
            // window.location.href = 'admin.html';
            window.location.href = '../admin/index.html';

        } else if (role === "CUSTOMER") {
            window.location.href = 'index.html';
        } else {
            alert('You don\'t have access to the dashboard');
        }
    })
    .catch(error => {
        console.error(error);
        alert('Email atau Password Salah');
    });
});

function logout(){
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    location.href = "index.html";
    console.log("kristus");
}

