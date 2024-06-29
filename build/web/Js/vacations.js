import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'
import { createTable } from './components.js'

export function loadVacationsModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    clearContainer(moduleContainer)
    moduleContainer.innerHTML = content

    loadModuleControls()
}

function clearContainer(container) {
    container.innerHTML = ''
}

async function loadModuleControls() {
    const btnSelectEmployee = document.querySelector('#btnSelectEmployee')
    const btnShowSelected = document.querySelector('#btnShowSelected')
    const btnSaveData = document.querySelector('#btnSave')
    const btnUpdate = document.querySelector('#btnUpdate')
    let employees = await getAllEmployees()

    let employeeSelected = null

    addFunctionToElement(() => openPanel(index => { employeeSelected = index }, employees), btnSelectEmployee)
    addFunctionToElement(() => showEmployeeSelected(employeeSelected, employees), btnShowSelected)
    addFunctionToElement(() => saveVacationsData(employeeSelected), btnSaveData)
    addFunctionToElement(() => createTableOnPanel(), btnUpdate)
}

function addFunctionToElement(event, element) {
    if (!element) return;

    element.addEventListener('click', event)
}

function openPanel(onSelectEmployee, employees) {
    togglePanelVisibility()

    loadPanelControls()

    loadEmployeeTable(onSelectEmployee, employees)
}

function togglePanelVisibility() {
    const sidePanel = document.querySelector('.form-container')

    if (sidePanel) {
        sidePanel.classList.toggle('form-active')
    }
}

function loadContentOnPanel(content) {
    const container = document.querySelector('#panel-container')

    container.innerHTML = ''

    if (!container.contains(content)) {
        container.appendChild(content)
    } else {
        alert("Ya lo tiene")
    }
}

function loadPanelControls() {
    const btnClosePanel = document.querySelector('#btnClosePanel')

    addFunctionToElement(togglePanelVisibility, btnClosePanel)
}

async function loadEmployeeTable(onSelectEmployee, employees) {
    const tableData = {
        Caption: "Tabla de empleados",
        Headers: ["Nombre", "Apellidos", "RFC", "NSS"],
        Id: "employees-table"
    }

    let table = createTable(tableData)

    loadContentOnPanel(table)

    const tableBody = document.querySelector('#employees-table')

    if (tableBody) {
        clearContainer(tableBody)
        employees.forEach((employee, index) => {
            let employeeInfo = {
                "Nombre": employee.persona.nombre,
                "Apellido": `${employee.persona.apellidoPaterno} ${employee.persona.apellidoMaterno}`,
                "RFC": employee.persona.rfc,
                "NSS": employee.persona.nss,
            }
            let employeeRow = createRow(employeeInfo, index, onSelectEmployee, employees)
            tableBody.appendChild(employeeRow)
        })
    }
}

function createRow(employeeInfo, index, onSelectEmployee, employees) {
    const row = document.createElement('tr')

    for (const key in employeeInfo) {
        if (employeeInfo.hasOwnProperty(key)) {
            const cell = document.createElement('th')
            cell.textContent = employeeInfo[key]
            row.appendChild(cell)
        }
    }

    row.addEventListener('click', () => {
        const rows = document.querySelectorAll('#employees-table tr');
        rows.forEach(row => row.classList.remove('selected'));
        row.classList.add('selected');

        onSelectEmployee(employees[index].idEmpleado)
    })

    return row
}

function showEmployeeSelected(employeeSelected, employees) {
    let employeeInfo = employees.filter(empleado => empleado.idEmpleado === employeeSelected)

    if (employeeSelected != null) {
        msg.questionMessage("Empleado Seleccionado", `${employeeInfo[0].persona.nombre} ${employeeInfo[0].persona.apellidoPaterno} ${employeeInfo[0].persona.apellidoMaterno}`)
    } else {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    }
}

async function getAllEmployees() {
    const URL = URL_BASE + '/empleado/getAll'

    const employees = await APIhlp.getAllData(URL)

    return employees
}

async function updateVacationsData(employeeSelected) {
    const URL = URL_BASE + '/vacacion/modificarSolicitud'
    const data = await hlp.getInputValues(getAllInputs())

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newVacations = createVacationsJson(response, employeeSelected, "Aceptada")

        let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

        if (apiResponse.response) {
            msg.successMessage("Solicitud Creada", "La solicitud de vacaciones se creo con exito")
        } else {
            msg.errorMessage("Error", "Hubo un error al crear la solicitud", "Por favor, vuelve a intentarlo.")
        }
    }
}

async function saveVacationsData(employeeSelected) {
    const URL = URL_BASE + '/vacacion/insertSolicitud'
    const data = await hlp.getInputValues(getAllInputs())

    let response = hlp.errorHandler(data)

    if (employeeSelected != null) {
        if (response.Header) {
            msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
        } else {
            let newVacations = createVacationsJson(response, employeeSelected, "Pendiente")

            let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

            if (apiResponse.response) {
                msg.successMessage("Solicitud Creada", "La solicitud de vacaciones se creo con exito")
            } else {
                msg.errorMessage("Error", "Hubo un error al crear la solicitud", "Por favor, vuelve a intentarlo.")
            }
        }
    } else {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    }
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtWeekStart', key: 'weekStart', name: "Inicio de Semana" },
        { selector: '#txtWeekEnd', key: 'weekEnd', name: "Fin de Semana" }
    ]

    return inputs
}

async function getAllVacations() {
    const URL = URL_BASE + '/vacacion/getAllSolicitudes'
    const response = await APIhlp.getAllData(URL)
}

function createTableOnPanel() {
    const tableData = {
        Caption: "Tabla de solicitudes de vacaciones",
        Headers: ["Nombre", "Fecha de Solicitud", "Fecha de Inicio", "Fecha de Fin", "Estatus"],
        Id: "vacationsContainer"
    }

    let newTable = createTable(tableData)

    togglePanelVisibility()
    loadPanelControls()

    loadContentOnPanel(newTable)
}

function createVacationsJson(data, employeeSelected, status) {
    const object = {
        empleado: {
            "idEmpleado": employeeSelected
        },
        "fechaInicio": data.weekStart,
        "fechaFin": data.weekEnd,
        "estatus": status
    }

    return object
}


// * Notas futuras
// * Hacer que el panel no contenga la tabla desde el HTML, cambiarlo a que se agregue dinamicamente para evitar conflictos de contenido que desaparece