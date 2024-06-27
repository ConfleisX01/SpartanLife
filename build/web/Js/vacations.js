import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

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
    let employees = await getAllEmployees()

    let employeeSelected = null

    addFunctionToElement(() => openPanel(index => { employeeSelected = index }, employees), btnSelectEmployee)
    addFunctionToElement(() => showEmployeeSelected(employeeSelected, employees), btnShowSelected)
    addFunctionToElement(() => saveVacationsData(employeeSelected), btnSaveData)
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

function loadPanelControls() {
    const btnClosePanel = document.querySelector('#btnClosePanel')

    addFunctionToElement(togglePanelVisibility, btnClosePanel)
}

async function loadEmployeeTable(onSelectEmployee, employees) {
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

}

async function saveVacationsData(employeeSelected) {
    const URL = URL_BASE + '/vacacion/insertSolicitud'
    const inputsValues = await hlp.getInputValues(getAllInputs())
    
    if (inputsValues != null) {
        let vacation = createVacationsJson(inputsValues, employeeSelected)
        console.log(vacation)
        APIhlp.saveObjectApiData(URL, 'vacacion', vacation)
        msg.successMessage("Solicitud Creada", "La solicitud de vacaciones se creo con exito")
    } else {
        msg.errorMessage("Error", "Hubo un error al crear la solicitud", "Por favor, vuelve a intentarlo.")
    }
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtWeekStart', key: 'weekStart' },
        { selector: '#txtWeekEnd', key: 'weekEnd' }
    ]

    return inputs
}

function createVacationsJson(data, employeeSelected) {
    const object = {
        empleado: {
            "idEmpleado": employeeSelected
        },
        "fechaInicio": data.weekStart,
        "fechaFin": data.weekEnd,
        "estatus": "Pendiente"
    }

    return object
}