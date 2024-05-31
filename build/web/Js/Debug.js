// Funcion para cargar un modulo, usar para la creacion y uso de los modulos
export function loadModule(content) {
    document.getElementById('container-body').innerHTML = ""
    document.getElementById('container-body').innerHTML = content
}

export function verifyUser(userData) {
    const user = users.find(user => user.User === userData.User && user.Password === userData.Password)
    return user ? user.Rol : false
}

export function addUser(user) {
    users.push(user)
}

export function viewUsers() {
    console.log(users)
}

// Datos falsos
const users = [
    {
        "Name" : "Juan Pablo",
        "LastName" : "Perez Fernandez",
        "User": "Juan Pablo",
        "Password": "bestDev",
        "Rol": "ADMIN"
    },
    {
        "Name" : "Ana Maria",
        "LastName" : "Gomez Rodriguez",
        "User": "Ana Maria",
        "Password": "securePass123",
        "Rol": "USER"
    },
    {
        "Name" : "Carlos",
        "LastName" : "Perez Martinez",
        "User": "Carlos Perez",
        "Password": "myPassword",
        "Rol": "USER"
    },
    {
        "Name" : "Maria",
        "LastName" : "Lopez Hernandez",
        "User": "Maria Lopez",
        "Password": "pass1234",
        "Rol": "USER"
    }
];
