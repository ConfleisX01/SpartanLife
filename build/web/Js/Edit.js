import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'

// ? Funcion para cargar el modulo entero desde el menu
export function loadModule(content) {
    applyContentOnModule(content)

    loadControls()
    loadTable()
}

function applyContentOnModule(content = null) {
    const container = document.querySelector('#module-container')

    if (content) {
        container.innerHTML = content
    } else {
        alert("Modulo no encontrado, vuelva a intentarlo...")
    }
}

// ? Funcion para cargar los controles principales del modulo
async function loadControls() {
    const buttonNewEmployee = document.querySelector('#btnAddNew')
    const form = document.querySelector('.form-container')

    buttonNewEmployee.addEventListener('click', async () => {
        if (!form.classList.contains('form-active') && !form.classList.contains('form-edit')) {
            loadEmptyForm()
        } else {
            const response = await msg.confirmMessage("No se puede realizar esta accion", "Ciera el formulario antes de acceder a otro", "Cerrar Formulario")
            if (response) {
                closeForm()
            }
        }
    })
}

// ? Funcion para cargar la tabla de empleados con la informacion de los empleados
async function loadTable(data = null) {
    const tableBody = document.querySelector('#table-body')
    const form = document.querySelector('.form-container')

    if (data != null) {
        data.forEach((employee, index) => {
            let employeeItem = document.createElement('tr')
            let photo = document.createElement('th')
            let name = document.createElement('th')
            let born = document.createElement('th')
            let age = document.createElement('th')
            let job = document.createElement('th')
            let rfc = document.createElement('th')
            let curp = document.createElement('th')
            let nss = document.createElement('th')
            let old = document.createElement('th')
            let position = document.createElement('th')

            photo.textContent = employee.Foto
            name.textContent = employee.Nombre + " " + employee.Apellidos
            born.textContent = employee.Nacimiento
            age.textContent = employee.Edad
            job.textContent = employee.Puesto
            rfc.textContent = employee.RFC
            curp.textContent = employee.CURP
            nss.textContent = employee.NSS
            old.textContent = employee.Antiguedad
            position.textContent = employee.Sucursal

            employeeItem.appendChild(photo)
            employeeItem.appendChild(name)
            employeeItem.appendChild(born)
            employeeItem.appendChild(age)
            employeeItem.appendChild(job)
            employeeItem.appendChild(rfc)
            employeeItem.appendChild(curp)
            employeeItem.appendChild(nss)
            employeeItem.appendChild(old)
            employeeItem.appendChild(position)

            employeeItem.addEventListener('click', async () => {
                if (!form.classList.contains('form-active') || !form.classList.contains('form-empty')) {
                    loadEmployeeData(index)
                } else {
                    const response = await msg.confirmMessage("No se puede realizar esta accion", "Ciera el formulario antes de acceder a otro", "Cerrar Formulario")
                    if (response) {
                        closeForm()
                    }
                }
            })

            tableBody.appendChild(employeeItem)
        })
    }
}

// ? Funcion para cargar el empleado al formulario
function loadEmployeeData(index) {
    const employee = employees[index]

    loadDataOnForm(employee)
}

// ? Funcion para cargar el formulario con los datos del empleado seleccionado
function loadDataOnForm(employee) {
    let inputs = document.querySelectorAll('.form-container-inputs input')
    let form = document.querySelector('.form-container')
    let buttonsContainer = document.querySelector('.buttons-container')
    let buttonSave = document.createElement('button')
    const formDangerZone = document.querySelector('.form-danger-zone')

    buttonSave.classList.add('btn-base')
    buttonSave.classList.add('button_update')
    buttonSave.id = 'btnUpdate'
    buttonSave.innerHTML = "Guardar Cambios"

    // * Condicionamos a que solamente se agregue el boton si se abrio por primera vez el formulario
    if (!form.classList.contains('form-active')) {
        buttonsContainer.appendChild(buttonSave)
    }

    if (formDangerZone.classList.contains('d-none')) {
        formDangerZone.classList.remove('d-none')
    }

    // * Cargamos los datos del empleado en el formulario para modificarlos
    inputs[0].value = employee.Nombre
    inputs[1].value = employee.Apellidos
    inputs[2].value = setFormatedDate(employee.Nacimiento)
    inputs[3].value = employee.Edad
    inputs[4].value = employee.Puesto
    inputs[5].value = employee.RFC
    inputs[6].value = employee.CURP
    inputs[7].value = employee.NSS
    inputs[8].value = employee.Antiguedad
    inputs[9].value = employee.Sucursal

    form.classList.add('form-active')
    form.classList.add('form-edit')

    loadControlsForm()
}

// ? Funcion para mostrar un formulario vacio para agregar un empleado nuevo
async function loadEmptyForm() {
    const BRANCH_URL = ''
    const JOB_URL = ''
    const form = document.querySelector('.form-container')
    const formDangerZone = document.querySelector('.form-danger-zone')
    const branchs = 

    cleanForm()

    if (!form.classList.contains('form-active')) {
        const buttonSaveNew = document.createElement('button')
        const buttonsContainer = document.querySelector('.buttons-container')
        buttonSaveNew.classList.add('btn-base')
        buttonSaveNew.classList.add('button_save')
        buttonSaveNew.textContent = "Guardar Empleado"
        buttonSaveNew.id = "btnSave"

        formDangerZone.classList.add('d-none')

        buttonsContainer.innerHTML = ''

        if (!form.classList.contains('form-active')) {
            buttonsContainer.appendChild(buttonSaveNew)
        }
    }

    loadControlsForm()

    form.classList.add('form-active')
    form.classList.add('form-empty')
}

// ? Funcion para formatear una fecha DD/MM/YYYY al formato de los inptus tipo DATE
function setFormatedDate(dateString) {
    const parts = dateString.split('/')
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    const formatedDate = `${year}-${month}-${day}`

    return formatedDate
}

// ? Funcion para cargar los controles del formulario de edicion
function loadControlsForm() {
    const form = document.querySelector('.form-container')
    const btnBack = document.querySelector('#btnBack')
    const btnSave = document.querySelector('#btnSave')
    const btnUpdate = document.querySelector('#btnUpdate')
    const btnDelete = document.querySelector('#btnDelete')

    btnBack.removeEventListener('click', closeForm)
    btnBack.addEventListener('click', closeForm)

    if (btnUpdate != null) {
        btnUpdate.removeEventListener('click', updateEmployee)
        btnUpdate.addEventListener('click', updateEmployee)
    }

    if (btnSave != null) {
        btnSave.removeEventListener('click', saveEmployee)
        btnSave.addEventListener('click', saveEmployee)
    }

    btnDelete.removeEventListener('click', deleteEmployee)
    btnDelete.addEventListener('click', deleteEmployee)
}

// ? Funcion para limpiar el formulario en caso de ser necesario
function cleanForm() {
    let inputs = document.querySelectorAll('.form-container-inputs input')

    inputs.forEach(input => {
        input.value = ''
    })
}

function closeForm() {
    const form = document.querySelector('.form-container')
    const buttonsContainer = document.querySelector('.buttons-container')

    buttonsContainer.innerHTML = ''

    form.classList.remove('form-active')
    form.classList.remove('form-edit')
    form.classList.remove('form-empty')
}

function updateEmployee() {
    alert("Actualizando los datos...")
}

function deleteEmployee() {
    alert("Borrando empleado...")
}

async function saveEmployee() {
    const data = await getInputValues(getAllInputs())
    const URL = 'http://localhost:8080/SpartanLife/api/empleado/insertEmpleado'

    let employee = createEmployeeJson(data)

    console.log(employee)

    APIhlp.saveObjectApiData(URL, 'empleado', employee)
}

async function getInputValues(inputs) {
    let data = {}

    for (const input of inputs) {
        const element = document.querySelector(input.selector)

        if (element) {
            const value = await verifyInputValue(element)

            if (value) {
                data[input.key] = value
            } else {
                alert("Formulario incompleto...")
            }
        }
    }

    return data
}

async function verifyInputValue(input) {
    if (input.type === 'file') {
        if (input.files.length > 0) {
            return await hlp.imageToBase64(input.files[0])
        } else {
            return false
        }
    } else {
        if (input.value != '') {
            return input.value
        } else {
            return false
        }
    }
}

function createEmployeeJson(data) {
    const employee = {
        persona: {
            "nombre": data.nombre,
            "apellidoPaterno": data.apellidos,
            "apellidoMaterno": data.apellidos, // ! Separar los apellidos
            "fechaNacimiento": data.fechaNacimiento,
            "rfc": data.rfc,
            "curp": data.curp,
            "nss": data.nss,
        },
        sucursal: {
            "idSucursal": 1 // ! Obtener el id de la sucursal
        },
        puesto: {
            "idPuesto": 1
        },
        "salarioDia": "500",
        "foto": data.foto,
        "pagoExtra": "500"
    }

    return employee
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtFoto', key: 'foto' },
        { selector: '#txtName', key: 'nombre' },
        { selector: '#txtLastName', key: 'apellidos' },
        { selector: '#txtBornDate', key: 'fechaNacimiento' },
        { selector: '#txtAge', key: 'edad' },
        { selector: '#txtJob', key: 'puesto' },
        { selector: '#txtRFC', key: 'rfc' },
        { selector: '#txtCURP', key: 'curp' },
        { selector: '#txtNSS', key: 'nss' },
        { selector: '#txtOld', key: 'antiguedad' },
        { selector: '#txtPosition', key: 'sucursal' },
    ]
    return inputs
}