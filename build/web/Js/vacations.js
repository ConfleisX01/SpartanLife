import * as msg from './messages.js'

export function loadVacationsModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    clearContainer(moduleContainer)
    moduleContainer.innerHTML = content

    loadModuleControls()
}

function clearContainer(container) {
    container.innerHTML = ''
}

function loadModuleControls() {
    const btnSelectEmployee = document.querySelector('#btnSelectEmployee')
    const btnShowSelected = document.querySelector('#btnShowSelected')

    let employeeSelected = null

    addFunctionToElement(() => openPanel(index => { employeeSelected = index }), btnSelectEmployee)
    addFunctionToElement(() => showEmployeeSelected(employeeSelected), btnShowSelected)
}

function addFunctionToElement(event, element) {
    if (!element) return;

    element.addEventListener('click', event)
}

function openPanel(onSelectEmployee) {
    togglePanelVisibility()

    loadPanelControls()

    loadEmployeeTable(onSelectEmployee)
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

function loadEmployeeTable(onSelectEmployee) {
    const tableBody = document.querySelector('#employees-table')

    if (tableBody) {
        clearContainer(tableBody)
        const employees = getAllEmployees()
        employees.forEach((employee, index) => {
            let employeeInfo = {
                "Nombre": employee.Nombre,
                "Apellido": employee.Apellidos,
                "RFC": employee.RFC,
                "NSS": employee.NSS,
            }
            let employeeRow = createRow(employeeInfo, index, onSelectEmployee)
            tableBody.appendChild(employeeRow)
        })
    }
}

function createRow(employeeInfo, index, onSelectEmployee) {
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

        onSelectEmployee(index)
    })

    return row
}

function showEmployeeSelected(employeeSelected) {
    const employees = getAllEmployees()

    if (employeeSelected == null) {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    } else {
        msg.questionMessage("Empleado Seleccionado", employees[employeeSelected].Nombre)
    }
}

function getAllEmployees() {
    return [
        {
            "Foto": "Sin Foto",
            "Nombre": "Juan Pablo",
            "Apellidos": "Perez Fernandez",
            "Nacimiento": "22/02/2004",
            "Edad": "20",
            "Puesto": "Desarrollador",
            "RFC": "PERJ040222HNLAJP01",
            "CURP": "PERJ040222HNLAJR08",
            "NSS": "12345678901",
            "Antiguedad": "2 meses",
            "Sucursal": "Delta"
        },
        {
            "Foto": "Sin Foto",
            "Nombre": "Ana Maria",
            "Apellidos": "Lopez Garcia",
            "Nacimiento": "15/08/1995",
            "Edad": "28",
            "Puesto": "Diseñadora",
            "RFC": "LOPA950815HNLRGC02",
            "CURP": "LOPA950815HNLRGA08",
            "NSS": "23456789012",
            "Antiguedad": "1 año",
            "Sucursal": "Gamma"
        },
        {
            "Foto": "Sin Foto",
            "Nombre": "Carlos Eduardo",
            "Apellidos": "Martinez Lopez",
            "Nacimiento": "30/11/1988",
            "Edad": "35",
            "Puesto": "Administrador",
            "RFC": "MARC881130HNLLZC03",
            "CURP": "MARC881130HNLLZE08",
            "NSS": "34567890123",
            "Antiguedad": "5 años",
            "Sucursal": "Alpha"
        },
        {
            "Foto": "Sin Foto",
            "Nombre": "Beatriz Elena",
            "Apellidos": "Ramirez Gonzalez",
            "Nacimiento": "07/05/1992",
            "Edad": "32",
            "Puesto": "Recursos Humanos",
            "RFC": "RAGB920507HNLMZB04",
            "CURP": "RAGB920507HNLMZE08",
            "NSS": "45678901234",
            "Antiguedad": "3 años",
            "Sucursal": "Beta"
        },
        {
            "Foto": "Sin Foto",
            "Nombre": "David Alonso",
            "Apellidos": "Gonzalez Perez",
            "Nacimiento": "12/03/2000",
            "Edad": "24",
            "Puesto": "Contador",
            "RFC": "GOPD000312HNLGZA05",
            "CURP": "GOPD000312HNLGZA08",
            "NSS": "56789012345",
            "Antiguedad": "6 meses",
            "Sucursal": "Delta"
        }
    ]
}