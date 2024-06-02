// Objeto para mostrar mensajes dinamicamente
import * as msg from './messages.js'
// Objeto para usar los helpers
import * as hlp from './helpers.js'
//Objeto para usar los helpers de las APIS
import * as APIhlp from './APIHelpers.js'
//Objeto para debugear
import * as Dbg from './Debug.js'

async function loadIndexControls() {
    let btnLogin = document.getElementById('btnLogin')

    btnLogin.addEventListener('click', async () => {
        const content = await hlp.getModule("Html/Sesion/account.html")
        hlp.applyContent(content, "container-body")
        loadSesionControls()
    })
}

async function loadSesionControls() {
    let btnCreateAccount = document.getElementById('btnCreateAccount')
    let btnLoginUser = document.getElementById('btnLoginUser')
    let btnLoginStart = document.getElementById('btnLoginStart')
    let btnCreate = document.getElementById('btnCreate')
    let lbUser = document.getElementById('txtUser')
    let lbPassword = document.getElementById('txtPassword')
    let chRemeberUser = document.getElementById('rememberUser')
    let lbUserName = document.getElementById('txtNames')
    let lbUserLastName = document.getElementById('txtLastNames')
    let lbUserCreate = document.getElementById('txtUserCreate')
    let lbPasswordCreate = document.getElementById('txtPasswordCreate')

    const loginElements = [lbUser, lbPassword]
    const signinElements = [lbUserName, lbUserLastName, lbUserCreate, lbPasswordCreate]

    btnCreateAccount.addEventListener('click', () => {
        switchAccountMode(0)
    })

    btnLoginUser.addEventListener('click', () => {
        switchAccountMode(1)
    })

    btnLoginStart.addEventListener('click', () => {
        if (hlp.verifyInputs(loginElements)) {
            let user = { "User": lbUser.value, "Password": lbPassword.value }
            if (Dbg.verifyUser(user)) {
                msg.successMessage("Usuario Verificado", "Ingresando al sistema")
            } else {
                msg.errorMessage("Usuario Incorrecto", "El usuario ingresado no existe", "Ingrese un usuario existente")
            }
        } else {
            msg.errorMessage("Entradas Vacias", "Error al verificar el usuario", "Rellene todos los campos solicitados del formulario")
        }
    })

    btnCreate.addEventListener('click', () => {
        if (hlp.verifyInputs(signinElements)) {
            let user = { "Name" : lbUserName.value, "LastName" : lbUserLastName.value, "User" : lbUserCreate.value, "Password" : lbPasswordCreate.value, "Rol" : "USER"}
            Dbg.addUser(user)
            msg.successMessage("Usuario Creado", "Se ha creado el usuario con exito")
            Dbg.viewUsers()
        } else {
            msg.errorMessage("Entradas Vacias", "Error al crear el usuario", "Rellene todos los campos solicitados del formulario")
        }
    })
}

function switchAccountMode(position) {
    let containerLogin = document.getElementById('container-login')
    let containerSigin = document.getElementById('container-signin')

    if(position == 0) {
        containerLogin.classList.add('d-none')
        containerSigin.classList.remove('d-none')
    } else if (position == 1) {
        containerLogin.classList.remove('d-none')
        containerSigin.classList.add('d-none')
    }
}

loadIndexControls()

//Dbg.loadModule(await hlp.getModule('./Html/Sesion/login.html'))