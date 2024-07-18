import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'
import * as cmp from './components.js'

let html

export function loadVacationsModule(content) {
    applyContentOnModule(content)

    loadModuleControls()

    html = content
}

function applyContentOnModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    moduleContainer.innerHTML = content
}

async function loadModuleControls() {
    const data = await getAllData()
    const employees = data[0]
    const vacations = data[1]

    let employeeSelected = null
    let vacationSelected = null

    function updateEmployeeSelected(newData) {
        employeeSelected = newData
    }

    function updateVacationsPetition(newData) {
        vacationSelected = newData
    }

    loadPanelControls()

    updateAlertStatus()

    if (!vacations.response) {
        appendVacationsTable(vacations, updateVacationsPetition)
    }

    const buttonSelectEmployee = document.querySelector('#btnSelectEmployee')
    buttonSelectEmployee.addEventListener('click', () => selectEmployee(employees, updateEmployeeSelected))

    const buttonSave = document.querySelector('#btnSave')
    buttonSave.addEventListener('click', () => saveVacation(employeeSelected))

    const buttonUpdate = document.querySelector('#btnUpdate')
    buttonUpdate.addEventListener('click', () => updateVacation(vacationSelected))
}

function selectEmployee(content, updateEmployeeSelected) {
    setPanelContent(content, updateEmployeeSelected)
    modifyPanelTitles('Selección de Empleados', 'Selecciona un empleado para registrar una solicitud de vacaciones')
    togglePanelVisibility()
}

function togglePanelVisibility() {
    const panel = document.querySelector('.form-container')

    panel.classList.toggle('form-active')
}

function loadPanelControls() {
    const btnClosePanel = document.querySelector('#btnClosePanel')
    const btnExpandPanel = document.querySelector('#btnPlus')
    const btnRelasePanel = document.querySelector('#btnMinus')

    btnClosePanel.addEventListener('click', togglePanelVisibility)

    btnExpandPanel.addEventListener('click', () => modifyPanelWidth(100))

    btnRelasePanel.addEventListener('click', () => modifyPanelWidth(-100))
}

function modifyPanelWidth(value) {
    const rootElement = document.documentElement
    let panelWidth = getComputedStyle(rootElement).getPropertyValue('--panel-width').trim()

    let pixelValue = parseFloat(panelWidth)

    let newWidth = pixelValue + value

    if (newWidth < 500) {
        newWidth = 500
    } else if (newWidth > 800) {
        newWidth = 800
    }

    rootElement.style.setProperty('--panel-width', `${newWidth}px`);
}

function modifyPanelTitles(title, subtitle) {
    const panelTitle = document.querySelector('#panelTitle').textContent = title
    const panelSubTitle = document.querySelector('#panelSubtitle').textContent = subtitle
}

async function setPanelContent(content, updateEmployeeSelected) {
    const panelContentContainer = document.querySelector('#panel-container')

    if (panelContentContainer) {
        cleanPanelContentContainer()

        const table = createTable(content[0].persona, 'Tabla de empleados', 'table-employees')

        const tableBody = table.querySelector('#table-employees')

        const entries = [
            'persona.nombre',
            'persona.apellidoPaterno',
            'persona.apellidoMaterno',
            'persona.fechaNacimiento',
            'persona.edad',
            'persona.rfc',
            'persona.curp',
            'persona.nss'
        ]

        createTableContent(content, tableBody, updateEmployeeSelected, entries)

        panelContentContainer.appendChild(table)

    } else {
        msg.errorMessage("Error al cargar el panel", "No se pudo cargar el contenido en el panel", "Repita la acción nuevamente")
    }
}

function cleanPanelContentContainer() {
    const panelContentContainer = document.querySelector('#panel-container')

    panelContentContainer.innerHTML = ''
}

function appendVacationsTable(data, updateVacationsPetition) {
    const container = document.querySelector('#container-table-vacations')

    const newHeaders = modifyVacationsJson(data[0])

    let newVacationsJson = []

    data.forEach(data => {
        newVacationsJson.push(modifyVacationsJson(data))
    })

    let table = createTable(newHeaders, 'Tabla de vacaciones', 'table-vacations')

    const tableBody = table.querySelector('#table-vacations')

    const entries = [
        'nombre',
        'fechaSolicitud',
        'fechaInicio',
        'fechaFin',
        'estatus'
    ]

    createTableContent(newVacationsJson, tableBody, null, entries, updateVacationsPetition)

    container.appendChild(table)
}

function createTable(content, caption, id) {
    let table

    let headers = getObjetProperties(content)
    let [, ...restHeaders] = headers

    table = cmp.createTable({
        Caption: caption,
        Headers: restHeaders,
        Id: id
    })

    return table
}

function createTableContent(content, container, updateEmployeeSelected, properties = [], updateVacationsPetition) {
    content.forEach(item => {
        let row = document.createElement('tr')

        properties.forEach(property => {
            let cell = document.createElement('td')

            let value = property.split('.').reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : '', item)

            cell.textContent = value

            row.appendChild(cell)
        });

        row.addEventListener('click', () => {
            if (updateEmployeeSelected != null) {
                updateEmployeeSelected(item)
                if (item.persona) {
                    updateAlertStatus(`${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno} (Creando nueva solicitud)`)
                }
            } else if (updateVacationsPetition != null) {
                updateVacationsPetition(item)
                updateAlertStatus(`${item.nombre} (Modificando solicitud existente)`)
                setFormValues(item)
            }
        })

        container.appendChild(row)
    });
}

function getObjetProperties(object) {
    return reformatParameters(Object.keys(object))
}

function reformatParameters(parameters) {
    return parameters.map(parameter => {
        let words = parameter.split(/(?=[A-Z])/)

        let upperCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

        return upperCaseWords.join(' ')
    })
}

function updateAlertStatus(data) {
    const alert = document.querySelector('#selectionAlert')

    if (data == null) {
        alert.classList.add('alert-warning')
        alert.classList.remove('alert-success')
        alert.textContent = 'Ningún empleado seleccionado.'
    } else {
        alert.textContent = `Empleado seleccionado: ${data}`
        alert.classList.remove('alert-warning')
        alert.classList.add('alert-success')
    }
}

async function saveVacation(employeeSelected) {
    const URL = URL_BASE + '/vacacion/insertSolicitud'
    const data = await hlp.getInputValues(dataInputs())

    let response = hlp.errorHandler(data)

    if (employeeSelected != null) {
        if (response.Header) {
            msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
        } else {
            let newVacations = createVacationsJson(response, employeeSelected.idEmpleado, "Pendiente")

            let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

            if (apiResponse.response) {
                loadVacationsModule(html)
                msg.successMessage("Solicitud Creada", "La solicitud de vacaciones se creo con exito")
            } else {
                msg.errorMessage("Error", "Hubo un error al crear la solicitud", "Por favor, vuelve a intentarlo.")
            }
        }
    } else {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    }
}

async function updateVacation(vacationSelected) {
    const URL = URL_BASE + '/vacacion/modificarSolicitud'
    const data = await hlp.getInputValues(dataInputs())

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newVacations = createVacationUpdateJson(response, vacationSelected.idVacaciones, "Aceptada")

        let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

        if (apiResponse.response) {
            loadVacationsModule(html)
            msg.successMessage("Solicitud Actualizada", "La solicitud de vacaciones se actualizó con éxito")
        } else {
            msg.errorMessage("Error", "Hubo un error al actualizar la solicitud", "Por favor, vuelve a intentarlo.")
        }
    }
}

function modifyVacationsJson(json) {
    let newJson = {
        "idVacaciones": json.idVacaciones,
        "nombre": json.empleado.persona.nombre,
        "fechaSolicitud": json.fechaSolicitud,
        "fechaInicio": json.fechaInicio,
        "fechaFin": json.fechaFin,
        "estatus": json.estatus
    }

    return newJson
}

async function getAllEmployees() {
    const URL = URL_BASE + '/empleado/getAll'

    const employees = await APIhlp.getAllData(URL)

    return employees
}

async function getAllVacations() {
    const URL = URL_BASE + '/vacacion/getAllSolicitudes'
    const response = await APIhlp.getAllData(URL)

    return response
}

// * Esta funcion obtiene todos los valores o datos desde un inicio para ahorrar recursos al cargar los componentes
async function getAllData() {
    const data = []
    const employees = await getAllEmployees()
    const vacations = await getAllVacations()

    data.push(employees)
    data.push(vacations)

    return data
}

function dataInputs() {
    const inputs = [
        { selector: '#txtWeekStart', key: 'weekStart', name: "Inicio de Semana" },
        { selector: '#txtWeekEnd', key: 'weekEnd', name: "Fin de Semana" }
    ]

    return inputs
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

function createVacationUpdateJson(data, vacationSelected, status) {
    const object = {
        "idVacaciones": vacationSelected,
        "fechaInicio": data.weekStart,
        "fechaFin": data.weekEnd,
        "estatus": status
    }

    return object
}

function setFormValues(data) {
    const dataToForm = [data.fechaInicio, data.fechaFin]

    const inputs = dataInputs()

    inputs.map((input, index) => {
        let inputSelected = document.querySelector(input.selector)

        inputSelected.value = dataToForm[index]
    })
}