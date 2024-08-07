// Objeto para mostrar mensajes dinamicamente
import * as msg from './messages.js'
// Objeto para usar los helpers
import * as hlp from './helpers.js'
//Objeto para usar los helpers de las APIS
import * as APIhlp from './APIHelpers.js'
// Objeto para control del dashboard
import * as dsh from './Dashboard.js'
// Objeto para el control de los empleados
import * as emp from './Edit.js'
// Objeto para el control de las asistencias
import * as atn from './attendance.js'
// Objeto para el control de solicitudes de vacaciones
import * as vcs from './vacations.js'
// Objeto para el control de solicitudes de pagos
import * as pay from './pays.js'
// Objeto para el control de solicitudes de aguinaldos
import * as bon from './bonus.js'
// Objeto para el control de configuraciones de la sucursal
import * as entConfig from './enterprise.js'
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
    let btnCreateAccount = document.getElementById('btnCreateAccount');
    let btnLoginUser = document.getElementById('btnLoginUser');
    let btnLoginStart = document.getElementById('btnLoginStart');
    let btnCreate = document.getElementById('btnCreate');
    let lbUser = document.getElementById('txtUser');
    let lbPassword = document.getElementById('txtPassword');
    let chRemeberUser = document.getElementById('rememberUser');
    let lbUserName = document.getElementById('txtNames');
    let lbUserLastName = document.getElementById('txtLastNames');
    let lbUserCreate = document.getElementById('txtUserCreate');
    let lbPasswordCreate = document.getElementById('txtPasswordCreate');

    const loginElements = [lbUser, lbPassword];
    const signinElements = [lbUserName, lbUserLastName, lbUserCreate, lbPasswordCreate];

    btnCreateAccount.addEventListener('click', () => {
        switchAccountMode(0);
    });

    btnLoginUser.addEventListener('click', () => {
        switchAccountMode(1);
    });

    btnLoginStart.addEventListener('click', async () => {
        if (hlp.verifyInputs(loginElements)) {
            let user = { "User": lbUser.value, "Password": lbPassword.value };
            let verifiedUser = await Dbg.verifyUser(user);
            if (verifiedUser) {
                msg.successMessage("Usuario Verificado", "Ingresando al sistema");
                console.log(verifiedUser)
                loadDashboad(verifiedUser);
            } else {
                msg.errorMessage("Usuario Incorrecto", "El usuario ingresado no existe", "Ingrese un usuario existente");
            }
        } else {
            msg.errorMessage("Entradas Vacías", "Error al verificar el usuario", "Rellene todos los campos solicitados del formulario");
        }
    });

    btnCreate.addEventListener('click', () => {
        if (hlp.verifyInputs(signinElements)) {
            let user = { "Name": lbUserName.value, "LastName": lbUserLastName.value, "User": lbUserCreate.value, "Password": lbPasswordCreate.value, "Rol": "USER" };
            Dbg.addUser(user);
            msg.successMessage("Usuario Creado", "Se ha creado el usuario con éxito");
            Dbg.viewUsers();
        } else {
            msg.errorMessage("Entradas Vacías", "Error al crear el usuario", "Rellene todos los campos solicitados del formulario");
        }
    });
}


function switchAccountMode(position) {
    let containerLogin = document.getElementById('container-login')
    let containerSigin = document.getElementById('container-signin')

    if (position == 0) {
        containerLogin.classList.add('d-none')
        containerSigin.classList.remove('d-none')
    } else if (position == 1) {
        containerLogin.classList.remove('d-none')
        containerSigin.classList.add('d-none')
    }
}

// Funcion para cargar el DashBoard
function loadDashboad(user) {
            console.log("hola ")

    if (user.rol == 'ADMIN') {
        console.log("jola ")
        loadAdminDashboard()
        
    } else if (user.rol == 'USER') {
        loadUserDashboard()
    }
}

// Funcion para loguear al usuario tipo ADMIN
async function loadAdminDashboard() {
    const container = document.querySelector('body')

    const contentMenu = await hlp.getModule('Html/Dashboard/dashboard.html')

    container.innerHTML = ""
    container.innerHTML = contentMenu

    loadControls()

    // Cargamos por defecto el modulo vista de empleados
    const moduleViewEmployee = await hlp.getModule('Html/Empleado/Vista.html')
    dsh.loadUserViewTable(moduleViewEmployee)

    fixDashboard()
}

// Funcion para loguear al usuario tipo USER
function loadUserDashboard() {

}

// Funcion para arregar el error de las alertas en el dashboard
function fixDashboard() {
    const container = document.querySelector('body')
    container.classList.remove('swal2-height-auto')
}

function loadControls() {
    const btnListEmployee = document.querySelector('#btnListEmployee')
    const btnEditEmployee = document.querySelector('#btnEditEmployee')
    const btnAttendance = document.querySelector('#btnAttendance')
    const btnBonus = document.querySelector('#btnBonus')
    const btnVacations = document.querySelector('#btnVacations')
    const btnPay = document.querySelector('#btnPay')
    const btnExpand = document.querySelector('#btnExpand')
    const btnEnterpriseConfiguration = document.querySelector('#btnEnterpriseConfiguration')
    const btnConfig = document.querySelector('#btnConfig')
    const btnLogout = document.querySelector('#btnLogout')
    const sideMenu = document.querySelector('#sideBar')

    btnExpand.onclick = function () {
        sideMenu.classList.toggle('expanded')
    }

    btnListEmployee.addEventListener('click', async () => {
        const moduleViewEmployee = await hlp.getModule('Html/Empleado/Vista.html')
        dsh.loadUserViewTable(moduleViewEmployee)
    })

    btnEditEmployee.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Empleado/Editar.html')
        emp.loadModule(content)
    })

    btnAttendance.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Asistencias/Registro.html')
        atn.load(content)
    })

      btnBonus.addEventListener('click', async () => {
       const content = await hlp.getModule('Html/Pago/Aguinaldo.html')
        bon.loadBonusModule(content)
    })

    btnVacations.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Vacaciones/Solicitudes.html')
        vcs.loadVacationsModule(content)
    })

    btnPay.addEventListener('click', async () => {
       const content = await hlp.getModule('Html/Pago/Salario.html')
        pay.loadPaysModule(content)
    })

    btnEnterpriseConfiguration.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Empresa/Configuraciones.html')
        entConfig.loadEnterpriseConfigurationModule(content)
    })
}

// Funcion principal para cargar los controladores del sistema
//loadIndexControls()
// TODO: Funcion de prueba, eliminar cuando se termine de probar el apartado del dashboard
loadAdminDashboard()