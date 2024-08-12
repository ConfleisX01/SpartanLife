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
// Objeto para el control de solicitudes de Permisos
import * as per from './permisos.js'
// Objeto para el control de solicitudes de Permisos User
import * as per2 from './permisosUser.js'
// Objeto para el control de solicitudes de Incidencias
import * as inc from './incidencia.js'
// Objeto para el control de solicitudes de Incidencias
import * as inc2 from './incidenciaUser.js'
// Objeto para el control de configuraciones de la sucursal
import * as entConfig from './enterprise.js'
//Objeto para debugear
import * as Dbg from './Debug.js'
// solo se ocupa en la creacion
import { URL_BASE } from './config.js';

async function loadIndexControls() {
    let btnLogin = document.getElementById('btnLogin')

    btnLogin.addEventListener('click', async () => {
        const content = await hlp.getModule("Html/Sesion/account.html")
        hlp.applyContent(content, "container-body")
        loadSesionControls()
    })
}

async function verifyUserSession() {
    const token = hlp.getFromLocalStorage("token")

    if (token == null) {
        loadIndex()
    }

    if (token != null) {
        const URL = URL_BASE + '/usuario/verificarSesion?token=' + token
        const apiResponse = await APIhlp.getAllData(URL)

        if (!apiResponse.response) {
            await loadIndex()
        }

        if (apiResponse.idUsuario) {
            loadDashboad(apiResponse)
        }
    }
}

async function loadIndex() {
    const content = await hlp.getModule("index.html")
    hlp.applyContent(content, "container-body")

    loadIndexControls()
}

async function loadSesionControls() {
    let btnCreateAccount = document.getElementById('btnCreateAccount');
    let btnLoginUser = document.getElementById('btnLoginUser');
    let btnLoginStart = document.getElementById('btnLoginStart');
    let btnCreate = document.getElementById('btnCreate');
    let lbUser = document.getElementById('txtUser');
    let lbPassword = document.getElementById('txtPassword');
    let chRemeberUser = document.getElementById('rememberUser');
    let txtRol = document.getElementById('txtRol');
    let lbUserCreate = document.getElementById('txtUserCreate');
    let lbPasswordCreate = document.getElementById('txtPasswordCreate');

    const loginElements = [lbUser, lbPassword];
    const signinElements = [txtRol, lbUserCreate, lbPasswordCreate];

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
                localStorage.removeItem('token')
                hlp.saveToLocalStorage('token', verifiedUser.token)
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
            let user = { "rol": txtRol.value, "nombreUsuario": lbUserCreate.value, "contrasenia": lbPasswordCreate.value };
            const URL = URL_BASE + '/usuario/insertarUsuario';
            Dbg.addUser(URL, "usuario", user);
            msg.successMessage("Usuario Creado", "Se ha creado el usuario con éxito");
            Dbg.viewUsers();
            switchAccountMode(1)
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
    if (user.rol == 'ADMIN') {
        loadAdminDashboard(user)

    } else if (user.rol == 'USER') {
        loadUserDashboard(user)
    }
}

// Funcion para loguear al usuario tipo ADMIN
async function loadAdminDashboard(userInfo) {
    const container = document.querySelector('body')

    const contentMenu = await hlp.getModule('Html/Dashboard/dashboard.html')

    container.innerHTML = ""
    container.innerHTML = contentMenu

    loadControls()

    document.querySelector('#lbUserName').textContent = userInfo.nombreUsuario
    document.querySelector('#lbUserRole').textContent = userInfo.rol == 'ADMIN' ? "Administrador" : "Usuario"
    document.querySelector('#iconUser').classList.add('bi', 'bi-person-fill-gear')

    // Cargamos por defecto el modulo vista de empleados
    const moduleViewEmployee = await hlp.getModule('Html/Empleado/Vista.html')
    dsh.loadUserViewTable(moduleViewEmployee)

    fixAlertsOnDashboard()
}

// Funcion para loguear al usuario tipo USER
async function loadUserDashboard(userInfo) {
    const container = document.querySelector('body')

    const contentMenu = await hlp.getModule('Html/Dashboard/dashboardUser.html')

    container.innerHTML = ""
    container.innerHTML = contentMenu

    loadControlsUser()

    document.querySelector('#lbUserName').textContent = userInfo.nombreUsuario
    document.querySelector('#lbUserRole').textContent = userInfo.rol == 'ADMIN' ? "Administrador" : "Usuario"
    document.querySelector('#iconUser').classList.add('bi', 'bi-person-fill')

    // Cargamos por defecto el modulo vista de empleados
    const moduleViewEmployee = await hlp.getModule('Html/Empleado/Vista.html')
    dsh.loadUserViewTable(moduleViewEmployee)

    fixAlertsOnDashboard()
}

// Funcion para arregar el error de las alertas en el dashboard
function fixAlertsOnDashboard() {
    const container = document.querySelector('body')
    container.classList.remove('swal2-height-auto')
}

function setSelectedModule() {
    const modulesButtons = document.querySelectorAll('li')

    modulesButtons.forEach(item => {
        item.onclick = () => activeSelected(item)
    })

    function activeSelected(item) {
        modulesButtons.forEach(item => {
            item.classList.remove('menu-item_selected')
        })

        item.classList.add('menu-item_selected')
    }
}

function loadControls() {
    const btnListEmployee = document.querySelector('#btnListEmployee')
    const btnEditEmployee = document.querySelector('#btnEditEmployee')
    //const btnAttendance = document.querySelector('#btnAttendance')
    const btnPermiso = document.querySelector('#btnPermiso')
    const btnIncidencia = document.querySelector('#btnIncidencia')
    const btnVacations = document.querySelector('#btnVacations')
    //const btnPay = document.querySelector('#btnPay')
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

    // btnAttendance.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Asistencias/Registro.html')
    //     atn.load(content)
    // })

    // btnBonus.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Pago/Aguinaldo.html')
    //     bon.loadBonusModule(content)
    // })

    btnVacations.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Vacaciones/Solicitudes.html')
        vcs.loadVacationsModule(content)
    })

    btnPermiso.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Reportes/Permisos.html')
        per.loadPermisosModule(content)
    })

    btnIncidencia.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Reportes/Incidencias.html')
        inc.loadIncidenciasModule(content)
    })

    btnEnterpriseConfiguration.addEventListener('click', async () => {
        const content = await hlp.getModule('Html/Empresa/Configuraciones.html')
        entConfig.loadEnterpriseConfigurationModule(content)
    })

    btnLogout.addEventListener('click', () => {
        closeUserSession()
    })

    setSelectedModule()
}

function closeUserSession() {
    localStorage.removeItem('token')
    location.reload()
}

function loadControlsUser() {
    const btnListEmployee = document.querySelector('#btnListEmployee')
    const btnEditEmployee = document.querySelector('#btnEditEmployee')
    //const btnAttendance = document.querySelector('#btnAttendance')
    const btnPermiso = document.querySelector('#btnPermiso')
    const btnIncidencia = document.querySelector('#btnIncidencia')
    const btnVacations = document.querySelector('#btnVacations')
    //const btnPay = document.querySelector('#btnPay')
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

    // btnEditEmployee.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Empleado/Editar.html')
    //     emp.loadModule(content)
    // })

    btnPermiso.classList.add('d-none')
    btnEditEmployee.classList.add('d-none')
    btnIncidencia.classList.add('d-none')
    btnVacations.classList.add('d-none')
    btnEnterpriseConfiguration.classList.add('d-none')
    btnConfig.classList.add('d-none')

    btnLogout.addEventListener('click', () => {
        closeUserSession()
    })

    // btnAttendance.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Asistencias/Registro.html')
    //     atn.load(content)
    // })

    // btnBonus.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Pago/Aguinaldo.html')
    //     bon.loadBonusModule(content)
    // })

    // btnVacations.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Vacaciones/Solicitudes.html')
    //     vcs.loadVacationsModule(content)
    // })

    // btnPermiso.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Reportes/PermisosUser.html')
    //     per2.loadPermisosModule(content)
    // })

    // btnIncidencia.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Reportes/IncidenciasUser.html')
    //     inc2.loadIncidenciasModule(content)
    // })

    // btnEnterpriseConfiguration.addEventListener('click', async () => {
    //     const content = await hlp.getModule('Html/Empresa/Configuraciones.html')
    //     entConfig.loadEnterpriseConfigurationModule(content)
    // })
}

// Funcion principal para cargar los controladores del sistema
//loadIndexControls()
verifyUserSession()
// TODO: Funcion de prueba, eliminar cuando se termine de probar el apartado del dashboard
//loadAdminDashboard()
//loadUserDashboard()