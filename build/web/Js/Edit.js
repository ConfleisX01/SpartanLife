import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

// ? Funcion para cargar el modulo entero desde el menu
export async function loadModule(content) {
    const BRANCH_URL = URL_BASE + '/sucursal/getAll'
    const JOB_URL = URL_BASE + '/puesto/getAll'
    const URL = URL_BASE + '/empleado/getAll'
    const branchs = await APIhlp.getAllData(BRANCH_URL)
    const jobs = await APIhlp.getAllData(JOB_URL)
    const data = await APIhlp.getAllData(URL)
    applyContentOnModule(content)

    loadControls(branchs, jobs)
    loadTable(data, branchs, jobs)
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
async function loadControls(branchs, jobs) {
    const buttonNewEmployee = document.querySelector('#btnAddNew')
    const form = document.querySelector('.form-container')

    buttonNewEmployee.addEventListener('click', async () => {
        if (!form.classList.contains('form-active') && !form.classList.contains('form-edit')) {
            loadEmptyForm(branchs, jobs)
        } else {
            const response = await msg.confirmMessage("No se puede realizar esta accion", "Ciera el formulario antes de acceder a otro", "Cerrar Formulario")
            if (response) {
                closeForm()
            }
        }
    })
}

// ? Funcion para cargar la tabla de empleados con la informacion de los empleados
async function loadTable(data = null, branchs, jobs) {
    const tableBody = document.querySelector('#table-body')
    const form = document.querySelector('.form-container')

    if (data != null) {
        data.forEach((employee, index) => {
            let employeeItem = document.createElement('tr')
            let photo = document.createElement('th')
            let image = document.createElement('img')
            let name = document.createElement('th')
            let born = document.createElement('th')
            let age = document.createElement('th')
            let job = document.createElement('th')
            let rfc = document.createElement('th')
            let curp = document.createElement('th')
            let nss = document.createElement('th')
            let old = document.createElement('th')
            let position = document.createElement('th')

            image.src = employee.foto
            image.classList.add('employe-table-image')
            photo.appendChild(image)
            name.textContent = `${employee.persona.nombre} ${employee.persona.apellidoPaterno} ${employee.persona.apellidoMaterno}`
            born.textContent = employee.persona.fechaNacimiento
            age.textContent = employee.persona.edad
            job.textContent = employee.puesto.nombrePuesto
            rfc.textContent = employee.persona.rfc
            curp.textContent = employee.persona.curp
            nss.textContent = employee.persona.nss
            old.textContent = employee.antiguedad
            position.textContent = employee.sucursal.nombreSucursal

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
                    loadEmployeeData(data, index, branchs, jobs)
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
function loadEmployeeData(employees, index, branchs, jobs) {
    const employee = employees[index]

    loadDataOnForm(employee, branchs, jobs)
}

// ? Funcion para cargar el formulario con los datos del empleado seleccionado
function loadDataOnForm(employee, branchs, jobs) {
    let inputs = getAllInputs()
    let form = document.querySelector('.form-container')
    let buttonsContainer = document.querySelector('.buttons-container')
    let buttonSave = document.createElement('button')
    const formDangerZone = document.querySelector('.form-danger-zone')

    buttonSave.classList.add('btn-base')
    buttonSave.classList.add('button_update')
    buttonSave.id = 'btnUpdate'
    buttonSave.innerHTML = "Guardar Cambios"

    loadOptionsOnSelects(branchs, jobs)

    // * Condicionamos a que solamente se agregue el boton si se abrio por primera vez el formulario
    if (!form.classList.contains('form-active')) {
        buttonsContainer.appendChild(buttonSave)
    }

    if (formDangerZone.classList.contains('d-none')) {
        formDangerZone.classList.remove('d-none')
    }

    // * Cargamos los datos del empleado en el formulario para modificarlos
    let object = objectToFillForm(employee)

    fillFormWithData(inputs, object)

    form.classList.add('form-active')
    form.classList.add('form-edit')

    loadControlsForm(employee)
}

function fillFormWithData(inputs, data) {
    inputs.forEach(input => {
        const element = document.querySelector(input.selector)
        if (element) {
            element.value = data[input.key] || ''
        }
    })
}

// ? Funcion para mostrar un formulario vacio para agregar un empleado nuevo
async function loadEmptyForm(branchs, jobs) {
    const form = document.querySelector('.form-container')
    const formDangerZone = document.querySelector('.form-danger-zone')

    cleanForm()

    loadOptionsOnSelects(branchs, jobs)

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

function loadOptionsOnSelects(branchs = null, jobs = null) {
    const branchSelect = document.querySelector('#txtBranch')
    const jobSelect = document.querySelector('#txtJob')

    branchs.forEach(branch => {
        let option = document.createElement('option')
        option.value = branch.idSucursal
        option.text = branch.nombreSucursal

        branchSelect.appendChild(option)
    })

    jobs.forEach(job => {
        let option = document.createElement('option')
        option.value = job.idPuesto
        option.text = job.nombrePuesto

        jobSelect.appendChild(option)
    })
}

// ? Funcion para cargar los controles del formulario de edicion
function loadControlsForm(employee = null) {
    //const form = document.querySelector('.form-container')
    const btnBack = document.querySelector('#btnBack')
    const btnSave = document.querySelector('#btnSave')
    const btnUpdate = document.querySelector('#btnUpdate')
    const btnDelete = document.querySelector('#btnDelete')

    btnBack.removeEventListener('click', closeForm)
    btnBack.addEventListener('click', closeForm)

    if (btnUpdate != null) {
        btnUpdate.removeEventListener('click', () => updateEmployee(employee))
        btnUpdate.addEventListener('click', () => updateEmployee(employee))
    }

    if (btnSave != null) {
        btnSave.removeEventListener('click', saveEmployee)
        btnSave.addEventListener('click', saveEmployee)
    }

    btnDelete.removeEventListener('click', () => deleteEmployee(employee))
    btnDelete.addEventListener('click', () => deleteEmployee(employee))
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

async function updateEmployee(employee) {
    const data = await hlp.getInputValues(getAllInputs())
    const URL = URL_BASE + '/empleado/modificarEmpleado'

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newEmployee = createEmployeeJsonToUpdate(data, employee.persona.idPersona, employee.idEmpleado)

        const apiResponse = await APIhlp.saveObjectApiData(URL, "empleado", newEmployee)

        if (apiResponse.response) {
            msg.successMessage("Empleado Actualizado", "El empelado ha sido actualizado con éxito")
        } else {
            msg.errorMessage("Error", "Hubo un error al actualizar el empleado", "Por favor, vuelve a intentarlo.")
        }
    }
}

async function deleteEmployee(employee) {
    const data = await hlp.getInputValues(getAllInputs())
    const URL = URL_BASE + '/empleado/eliminarEmpleado'

    let newEmployee = createEmployeeJsonToUpdate(data, employee.persona.idPersona, employee.idEmpleado)
    const response = await msg.confirmMessage("Estas Seguro?", "La eliminacion de un empleado no se puede revertir", "Eliminar Empleado")

    if (response) {
        APIhlp.saveObjectApiData(URL, "empleado", newEmployee)
        msg.successMessage("Empleado Eliminado", "El emplado ha sido eliminado con éxito")
    } else {
        msg.errorMessage("Error", "Hubo un error al eliminar el empleado", "Por favor, vuelve a intentarlo.")
    }
}

async function saveEmployee() {
    const data = await hlp.getInputValues(getAllInputs())
    const URL = URL_BASE + '/empleado/insertEmpleado'

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newEmployee = createEmployeeJson(response)

        let apiResponse = await APIhlp.saveObjectApiData(URL, 'empleado', newEmployee)

        if (apiResponse.response) {
            msg.successMessage("Empleado Creado", "El empleado ha sido creado con éxito.")
        } else {
            msg.errorMessage("Error", "Hubo un error al crear el empleado", "Por favor, vuelve a intentarlo.")
        }
    }
}

function createEmployeeJson(data) {
    const employee = {
        persona: {
            "nombre": data.nombre,
            "apellidoPaterno": data.apellidoPaterno,
            "apellidoMaterno": data.apellidoMaterno,
            "fechaNacimiento": data.fechaNacimiento,
            "rfc": data.rfc,
            "curp": data.curp,
            "nss": data.nss
        },
        sucursal: {
            "idSucursal": data.sucursal
        },
        puesto: {
            "idPuesto": data.puesto
        },
        "salarioDia": data.salarioDia,
        "foto": data.foto,
        "pagoExtra": data.salarioExtra,
    }

    return employee
}

function createEmployeeJsonToUpdate(data, idPerson, idEmployee) {
    const employee = {
        persona: {
            "nombre": data.nombre,
            "apellidoPaterno": data.apellidoPaterno,
            "apellidoMaterno": data.apellidoMaterno,
            "fechaNacimiento": data.fechaNacimiento,
            "rfc": data.rfc,
            "curp": data.curp,
            "nss": data.nss,
            "idPersona": idPerson
        },
        sucursal: {
            "idSucursal": data.sucursal
        },
        puesto: {
            "idPuesto": data.puesto
        },
        "salarioDia": data.salarioDia,
        "foto": data.foto,
        "pagoExtra": data.salarioExtra,
        "idEmpleado": idEmployee
    }

    return employee
}

function objectToFillForm(data) {
    const newObject = {
        nombre: data.persona.nombre,
        apellidoPaterno: data.persona.apellidoPaterno,
        apellidoMaterno: data.persona.apellidoMaterno,
        fechaNacimiento: data.persona.fechaNacimiento,
        puesto: data.puesto.idPuesto,
        rfc: data.persona.rfc,
        curp: data.persona.curp,
        nss: data.persona.nss,
        salarioDia: data.salarioDia,
        salarioExtra: data.pagoExtra,
        sucursal: data.sucursal.idSucursal
    }

    return newObject
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtFoto', key: 'foto', name: "Foto" },
        { selector: '#txtName', key: 'nombre', name: "Nombre" },
        { selector: '#txtFirstLastName', key: 'apellidoPaterno', name: "Apellido Paterno" },
        { selector: '#txtSecondLastName', key: 'apellidoMaterno', name: "Apellido Materno" },
        { selector: '#txtBornDate', key: 'fechaNacimiento', name: "Fecha de Nacimiento" },
        { selector: '#txtJob', key: 'puesto', name: "Puesto" },
        { selector: '#txtRFC', key: 'rfc', name: "RFC" },
        { selector: '#txtCURP', key: 'curp', name: "CURP" },
        { selector: '#txtNSS', key: 'nss', name: "NSS" },
        { selector: '#txtSalaryDay', key: 'salarioDia', name: "Salario por dia" },
        { selector: '#txtSalaryExtra', key: 'salarioExtra', name: "Salario extra" },
        { selector: '#txtBranch', key: 'sucursal', name: "Sucursal" },
    ]
    return inputs
}