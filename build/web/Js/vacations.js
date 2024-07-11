import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'
import * as cmp from './components.js'

export function loadVacationsModule(content) {
    applyContentOnModule(content)

    loadModuleControls()
}

function applyContentOnModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    moduleContainer.innerHTML = content
}

async function loadModuleControls() {
    const data = await getAllData()
    const employees = data[0]

    const buttonSelectEmployee = document.querySelector('#btnSelectEmployee')
    buttonSelectEmployee.addEventListener('click', selectEmployee(employees, 'EMP'))
}

function selectEmployee(content, tableTypeContent) {
    setPanelContent(content, tableTypeContent)
    togglePanelVisibility()
}

function togglePanelVisibility() {
    const panel = document.querySelector('.form-container')

    panel.classList.toggle('form-active')
}

async function setPanelContent(tableTypeContent) {
    const panelContentContainer = document.querySelector('#panel-container')

    if (panelContentContainer) {
        cleanPanelContentContainer()

        const table = createTable(tableTypeContent)

        const tableBody = table.querySelector('tbody')

        panelContentContainer.appendChild(table)

    } else {
        msg.errorMessage("Error al cargar el panel", "No se pudo cargar el contenido en el panel", "Repita la accion nuevamente")
    }
}

function cleanPanelContentContainer() {
    const panelContentContainer = document.querySelector('#panel-container')

    panelContentContainer.innerHTML = ''
}

function createTable(tableTypeContent) {
    let table = cmp.createTable({
        Caption: "Tabla de empleados",
        Headers: ["Nombre del empleado", "Apellidos", "Sucursal", "RFC", "CURP", "NSS"],
        Id: "table-employees"
    })

    return table
}

async function getAllEmployees() {
    const URL = URL_BASE + '/empleado/getAll'

    const employees = await APIhlp.getAllData(URL)
    
    return employees
}

// * Esta funcion obtiene todos los valores o datos desde un inicio para ahorrar recursos al cargar los componentes
async function getAllData() {
    const data = []
    const employees = await getAllEmployees()

    data.push(employees)

    return data
}