import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import * as cng from './config.js'
import * as cmp from './components.js'

let html

export async function loadVacationsModule(content) {
    const data = await getAllData()

    applyContentOnModule(content)

    loadEmployeesTable(data)

    verityFileInputs()
}

function applyContentOnModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    moduleContainer.innerHTML = content
}

function loadEmployeesTable(data) {
    const EMPLOYEE_DATA_INDEX = 0
    const VACATIONS_DATA_INDEX = 1

    const containerList = document.querySelector('#employee-list-container')
    containerList.innerHTML = ''

    const employeeData = data[EMPLOYEE_DATA_INDEX]
    const vacationsData = data[VACATIONS_DATA_INDEX]

    const employeesList = employeeData.map(employee => {
        if (!vacationsData.response) {
            const hasPendingRequest = vacationsData.some(vacation =>
                vacation.empleado.idEmpleado == employee.idEmpleado && vacation.estatus == 'pendiente'
            )

            if (hasPendingRequest) {
                return {
                    ...employee,
                    pending: hasPendingRequest
                }
            } else {
                return {
                    ...employee
                }
            }
        } else {
            return {
                ...employee
            }
        }
    })

    employeesList.forEach((employee, index) => {
        let newItem = createEmployeeItemList(employee)

        newItem.addEventListener('click', () => targetEmployeeData(employee.idEmpleado, vacationsData, employee))

        containerList.appendChild(newItem)
    })
}

function targetEmployeeData(idEmployee, vacationsData, employeeData) {
    const newVacationsList = []
    const container = document.querySelector('#vacations-info_list')
    const btnCreateRequest = document.querySelector('#btnCreateRequest')

    if (!vacationsData.response) {
        vacationsData.map(vacation => {
            if (vacation.empleado.idEmpleado == idEmployee) {
                newVacationsList.push(vacation)
            }
            loadVacationsList(newVacationsList)
        })
    }

    changeEmployeeVacationsInfo(employeeData)
    btnCreateRequest.onclick = () => createNewVacationRequest(idEmployee, employeeData)

    updateFileButton()
    cleanForm()

    function loadVacationsList(vacationsData) {
        container.innerHTML = ''

        vacationsData.forEach(vacation => {
            const item = createVacationItem(vacation)
            container.appendChild(item)
        })
    }

    function changeEmployeeVacationsInfo(data) {
        const image = document.querySelector('.circle-vacations-info img')
        const vacationsLeft = document.querySelector('.circle-vacations-info h2 b')
        const vacationsLimit = document.querySelectorAll('.circle-vacations-info small')

        image.src = data.foto // Asignamos la foto
        vacationsLeft.textContent = data.vacacionesRestantes // Asignamos las vacaciones restantes
        vacationsLimit[1].textContent = `de ${data.limiteVacaciones} dias` // Asignamos el limite de vacaciones
    }

    function createVacationItem(data) {
        const item = document.createElement('div')
        item.classList.add('vacations-info_item', 'border-bottom', 'py-3')

        const firstRow = document.createElement('div')
        firstRow.classList.add('d-flex', 'justify-content-between', 'pointer')

        const spanInfo = document.createElement('span')
        spanInfo.classList.add('text-dark', 'mx-1')
        spanInfo.textContent = `${data.fechaInicio} - ${data.fechaFin} (${getDays(data.fechaInicio, data.fechaFin)} dias)`

        const spanStatus = document.createElement('span')
        if (data.estatus == 'aprobada') {
            spanStatus.textContent = 'Aprobada'
            spanStatus.classList.add('badge', 'text-bg-success')
        } else if (data.estatus == 'pendiente') {
            spanStatus.textContent = 'Pendiente'
            spanStatus.classList.add('badge', 'text-bg-warning')
        } else {
            spanStatus.textContent = 'Denegada'
            spanStatus.classList.add('badge', 'text-bg-danger')
        }

        firstRow.appendChild(spanInfo)
        firstRow.appendChild(spanStatus)

        item.appendChild(firstRow)

        return item
    }
}

async function createNewVacationRequest(idEmpleado, employeeData) {
    const data = await hlp.getInputValues(getAllRequestInputs())
    const VACATIONS_LIMIT = parseInt(employeeData.limiteVacaciones, 10);
    const VACATIONS_LEFT = parseInt(employeeData.vacacionesRestantes, 10);
    const URL = cng.URL_BASE + '/vacacion/insertSolicitud'

    let response = hlp.errorHandler(data)

    const diasSolicitados = getDays(response.fechaInicio, response.fechaFin)

    console.log(`${diasSolicitados} ${VACATIONS_LIMIT}`)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        if (verifyDate(response.fechaInicio, response.fechaFin)) {
            if (diasSolicitados > VACATIONS_LIMIT || diasSolicitados > VACATIONS_LEFT) {
                msg.errorMessage(
                    'Límite Excedido',
                    'Los días solicitados superan el límite permitido o las vacaciones disponibles.',
                    'Por favor, selecciona otras fechas.'
                )
            } else {
                const newRequest = createJsonRequest(response, idEmpleado)
                let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newRequest)
                if (apiResponse.response == 'OK') {
                    msg.successMessage('La solicitud se ha creado con éxito.')
                } else {
                    const serverMessage = hlp.handlerApiResponse(apiResponse, 'Error al crear la solicitud', 'Ocurrió un error. Por favor, vuelve a intentarlo más tarde.')
                    msg.errorMessage('Error al procesar la soliciud', serverMessage)
                }
            }
        } else {
            msg.errorMessage(
                'Fechas Incorrectas',
                'Las fechas seleccionadas no son válidas.',
                'Por favor, vuelve a intentarlo.'
            )
        }
    }
}

function createEmployeeItemList(data) {
    let item = document.createElement('div')

    item.classList.add('vacations-list-employee', 'row')
    let firstRow = document.createElement('div')
    firstRow.classList.add('col-11')

    let employeeImage = document.createElement('img')
    employeeImage.classList.add('rounded-circle', 'mx-2')
    employeeImage.style.width = '2.5rem'
    employeeImage.style.height = '2.5rem'
    employeeImage.src = data.foto

    let employeeName = document.createElement('small')
    employeeName.classList.add('m-0')
    employeeName.textContent = `${data.persona.nombre} ${data.persona.apellidoPaterno} ${data.persona.apellidoMaterno}`

    let secondRow = document.createElement('div')
    secondRow.classList.add('col-1', 'text-muted', 'd-flex', 'align-items-center', 'justify-content-center')

    let alert = document.createElement('span')
    alert.classList.add('p-2', 'bg-primary-light', 'border', 'border-primary', 'rounded-circle', 'animate__animated', 'animate__pulse', 'animate__infinite')

    firstRow.appendChild(employeeImage)
    firstRow.appendChild(employeeName)

    if (data.pending) {
        secondRow.appendChild(alert)
    }

    item.appendChild(firstRow)
    item.appendChild(secondRow)

    return item
}

function verityFileInputs() {
    const supportInput = document.querySelector("input[type='file']")
    const SUPPORT_ITEM_INDEX = 0

    supportInput.addEventListener('change', function(event) {
        const file = event.target.files[0]
        verifyFile(file, 'application/pdf', SUPPORT_ITEM_INDEX)
    })
}

function verifyFile(file, mime, indexItem) {
    const MAX_FILE_SIZE = 5

    if (file.type === mime || file.type.match(mime)) {
        if (hlp.getFileSize(file) <= MAX_FILE_SIZE) {
            asingFileDataInHolders(file, indexItem)
        } else {
            msg.errorMessage('Archivo demasiado grande', 'El archivo excede el límite de 5MB.', 'Por favor, cargue un archivo de menor tamaño.');
        }
    } else {
        let fileType = mime === 'image/*' ? 'imagen' : 'PDF'
        msg.errorMessage('Tipo de archivo no soportado', 'El archivo seleccionado no esta soportado para este campo', 'Por favor, cargue un archivo en formato de ' + fileType);
    }
}

async function asingFileDataInHolders(file, indexHolder) {
    let fileConverted = await getBase64FileData(file)

    setDataToFileDataHolder(fileConverted, indexHolder)
}

async function setDataToFileDataHolder(baseData, indexHolder) {
    const holders = getAllFileHolders()

    if (holders[indexHolder].value == '') {
        updateFileButton()
        holders[indexHolder].value = baseData
    } else {
        const userResponse = await msg.confirmMessage('Remplazar archivo?', "Quieres remplazar el archivo guardado por uno nuevo?", 'Reemplazar')
        if (userResponse) {
            updateFileButton()
            holders[indexHolder].value = baseData
        }
    }
}

function cleanForm() {
    const inputs = document.querySelectorAll('input')
    const areas = document.querySelectorAll('textarea')

    inputs.forEach(input => {
        input.value = ''
    })

    areas.forEach(input => {
        input.value = ''
    })
}

async function updateFileButton() {
    const holders = getAllFileHolders()
    const buttons = document.querySelectorAll('.file-button')
    let index = 0

    for (const holder of holders) {
        let value = await holder.value // COMENTARIOS DEL PROGRAMADOR Confleis: La verdad no se porque funciona esto, pero al obtener los valores en base64, la imagen es retornada como cadena vacia
        value = await holder.value // COMENTARIOS DEL PROGRMADOR Confleis: Me quedo sin tiempo pero al hacer esto se soluciona el problema, la verdad no se porque pero funciona!!!!! :)
        changeButtonsState(value, buttons[index])
        index++
    }

    setFileViewer()
}

function changeButtonsState(value, button) {
    if (value != '') {
        button.classList.add('item-added_fill')
    } else {
        button.classList.remove('item-added_fill')
    }
}

function setFileViewer() {
    const buttons = document.querySelectorAll('.file-button')

    buttons.forEach((button, index) => {
        button.removeEventListener('click', () => showFileViewer(index))
        button.addEventListener('click', () => showFileViewer(index))
    })
}

function getAllFileHolders() {
    const supportHolder = document.querySelector('#txtFileSupportData')
    const inputsArray = []

    inputsArray.push(supportHolder)

    return inputsArray
}

function showFileViewer(index) {
    const holders = getAllFileHolders()
    const holdersValues = []

    holders.forEach(holder => {
        holdersValues.push(holder.value)
    })

    let data = holdersValues[index]

    if (data.startsWith('data:image')) {
        msg.showImage(data)
    } else if (data.startsWith('data:application/pdf')) {
        msg.showFrame(data)
    }
}

async function getBase64FileData(file) {
    return await hlp.fileToBase64(file)
}

async function getAllData() {
    const URL_EMPLOYEES = cng.URL_BASE + '/empleado/getAll'
    const URL_VACATIONS = cng.URL_BASE + '/vacacion/getAllSolicitudes'
    const data = []

    const employeeListData = await APIhlp.getAllData(URL_EMPLOYEES)
    const vacationsListData = await APIhlp.getAllData(URL_VACATIONS)

    const employeeByName = employeeListData.sort((a, b) => {
        return a.persona.nombre.localeCompare(b.persona.nombre)
    })

    data.push(employeeByName)
    data.push(vacationsListData)

    return data
}

function getAllRequestInputs() {
    const inputs = [
        { selector: '#txtStartVacations', key: 'fechaInicio', name: "Fecha de inicio" },
        { selector: '#txtEndVacations', key: 'fechaFin', name: "Fecha de fin" },
        { selector: '#txtCreadtedBy', key: 'nombreCreador', name: "Nombre del creador de la solicitud" },
        { selector: '#txtCommentsC', key: 'comentariosCreador', name: "Comentarios del creador" },
        { selector: '#txtCommentsE', key: 'comentariosEmpleado', name: "Comentarios del empleado" },
        { selector: '#txtFileSupportData', key: 'documentoSoporte', name: "Documento de soporte", required: false }
    ]
    return inputs
}

function createJsonRequest(data, idEmpleado) {
    const newRequest = {
        empleado: {
            "idEmpleado": idEmpleado,
        },
        "fechaInicio": data.fechaInicio,
        "fechaFin": data.fechaFin,
        "diasSolicitados": getDays(data.fechaInicio, data.fechaFin),
        "comentarioAprobador": data.comentariosCreador,
        "comentarioEmpleado": data.comentariosEmpleado,
        "documentoSoporte": data.documentoSoporte ? data.documentoSoporte : ''
    }

    return newRequest
}

function verifyDate(startDate, endDate) {
    const daysResult = getDays(startDate, endDate)

    return daysResult > 0 ? true : false
}

function getDays(startDate, endDate) {
    const start = new Date(startDate)
    const end = new Date(endDate)

    const differenceInTime = end.getTime() - start.getTime()

    const differenceInDays = differenceInTime / (1000 * 3600 * 24)

    return Math.round(differenceInDays + 1)
}


// async function loadModuleControls() {
//     const data = await getAllData()
//     const employees = data[0]
//     const vacations = data[1]

//     let employeeSelected = null
//     let vacationSelected = null

//     function updateEmployeeSelected(newData) {
//         employeeSelected = newData
//     }

//     function updateVacationsPetition(newData) {
//         vacationSelected = newData
//     }

//     loadPanelControls()

//     updateAlertStatus()

//     if (!vacations.response) {
//         appendVacationsTable(vacations, updateVacationsPetition)
//     }

//     const buttonSelectEmployee = document.querySelector('#btnSelectEmployee')
//     buttonSelectEmployee.addEventListener('click', () => selectEmployee(employees, updateEmployeeSelected))

//     const buttonSave = document.querySelector('#btnSave')
//     buttonSave.addEventListener('click', () => saveVacation(employeeSelected))

//     const buttonUpdate = document.querySelector('#btnUpdate')
//     buttonUpdate.addEventListener('click', () => updateVacation(vacationSelected))
// }

// function selectEmployee(content, updateEmployeeSelected) {
//     setPanelContent(content, updateEmployeeSelected)
//     modifyPanelTitles('Selección de Empleados', 'Selecciona un empleado para registrar una solicitud de vacaciones')
//     togglePanelVisibility()
// }

// function togglePanelVisibility() {
//     const panel = document.querySelector('.form-container')

//     panel.classList.toggle('form-active')
// }

// function loadPanelControls() {
//     const btnClosePanel = document.querySelector('#btnClosePanel')
//     const btnExpandPanel = document.querySelector('#btnPlus')
//     const btnRelasePanel = document.querySelector('#btnMinus')

//     btnClosePanel.addEventListener('click', togglePanelVisibility)

//     btnExpandPanel.addEventListener('click', () => modifyPanelWidth(100))

//     btnRelasePanel.addEventListener('click', () => modifyPanelWidth(-100))
// }

// function modifyPanelWidth(value) {
//     const rootElement = document.documentElement
//     let panelWidth = getComputedStyle(rootElement).getPropertyValue('--panel-width').trim()

//     let pixelValue = parseFloat(panelWidth)

//     let newWidth = pixelValue + value

//     if (newWidth < 500) {
//         newWidth = 500
//     } else if (newWidth > 800) {
//         newWidth = 800
//     }

//     rootElement.style.setProperty('--panel-width', `${newWidth}px`);
// }

// function modifyPanelTitles(title, subtitle) {
//     const panelTitle = document.querySelector('#panelTitle').textContent = title
//     const panelSubTitle = document.querySelector('#panelSubtitle').textContent = subtitle
// }

// async function setPanelContent(content, updateEmployeeSelected) {
//     const panelContentContainer = document.querySelector('#panel-container')

//     if (panelContentContainer) {
//         cleanPanelContentContainer()

//         const table = createTable(content[0].persona, 'Tabla de empleados', 'table-employees')

//         const tableBody = table.querySelector('#table-employees')

//         const entries = [
//             'persona.nombre',
//             'persona.apellidoPaterno',
//             'persona.apellidoMaterno',
//             'persona.fechaNacimiento',
//             'persona.edad',
//             'persona.rfc',
//             'persona.curp',
//             'persona.nss'
//         ]

//         createTableContent(content, tableBody, updateEmployeeSelected, entries)

//         panelContentContainer.appendChild(table)

//     } else {
//         msg.errorMessage("Error al cargar el panel", "No se pudo cargar el contenido en el panel", "Repita la acción nuevamente")
//     }
// }

// function cleanPanelContentContainer() {
//     const panelContentContainer = document.querySelector('#panel-container')

//     panelContentContainer.innerHTML = ''
// }

// function appendVacationsTable(data, updateVacationsPetition) {
//     const container = document.querySelector('#container-table-vacations')

//     const newHeaders = modifyVacationsJson(data[0])

//     let newVacationsJson = []

//     data.forEach(data => {
//         newVacationsJson.push(modifyVacationsJson(data))
//     })

//     let table = createTable(newHeaders, 'Tabla de vacaciones', 'table-vacations')

//     const tableBody = table.querySelector('#table-vacations')

//     const entries = [
//         'nombre',
//         'fechaSolicitud',
//         'fechaInicio',
//         'fechaFin',
//         'estatus'
//     ]

//     createTableContent(newVacationsJson, tableBody, null, entries, updateVacationsPetition)

//     container.appendChild(table)
// }

// function createTable(content, caption, id) {
//     let table

//     let headers = getObjetProperties(content)
//     let [, ...restHeaders] = headers

//     table = cmp.createTable({
//         Caption: caption,
//         Headers: restHeaders,
//         Id: id
//     })

//     return table
// }

// function createTableContent(content, container, updateEmployeeSelected, properties = [], updateVacationsPetition) {
//     content.forEach(item => {
//         let row = document.createElement('tr')

//         properties.forEach(property => {
//             let cell = document.createElement('td')

//             let value = property.split('.').reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : '', item)

//             cell.textContent = value

//             row.appendChild(cell)
//         });

//         row.addEventListener('click', () => {
//             if (updateEmployeeSelected != null) {
//                 updateEmployeeSelected(item)
//                 if (item.persona) {
//                     updateAlertStatus(`${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno} (Creando nueva solicitud)`)
//                 }
//             } else if (updateVacationsPetition != null) {
//                 updateVacationsPetition(item)
//                 updateAlertStatus(`${item.nombre} (Modificando solicitud existente)`)
//                 setFormValues(item)
//             }
//         })

//         container.appendChild(row)
//     });
// }

// function getObjetProperties(object) {
//     return reformatParameters(Object.keys(object))
// }

// function reformatParameters(parameters) {
//     return parameters.map(parameter => {
//         let words = parameter.split(/(?=[A-Z])/)

//         let upperCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())

//         return upperCaseWords.join(' ')
//     })
// }

// function updateAlertStatus(data) {
//     const alert = document.querySelector('#selectionAlert')

//     if (data == null) {
//         alert.classList.add('alert-warning')
//         alert.classList.remove('alert-success')
//         alert.textContent = 'Ningún empleado seleccionado.'
//     } else {
//         alert.textContent = `Empleado seleccionado: ${data}`
//         alert.classList.remove('alert-warning')
//         alert.classList.add('alert-success')
//     }
// }

// async function saveVacation(employeeSelected) {
//     const URL = URL_BASE + '/vacacion/insertSolicitud'
//     const data = await hlp.getInputValues(dataInputs())

//     let response = hlp.errorHandler(data)

//     if (employeeSelected != null) {
//         if (response.Header) {
//             msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
//         } else {
//             let newVacations = createVacationsJson(response, employeeSelected.idEmpleado, "Pendiente")

//             let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

//             if (apiResponse.response) {
//                 loadVacationsModule(html)
//                 msg.successMessage("Solicitud Creada", "La solicitud de vacaciones se creo con exito")
//             } else {
//                 msg.errorMessage("Error", "Hubo un error al crear la solicitud", "Por favor, vuelve a intentarlo.")
//             }
//         }
//     } else {
//         msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
//     }
// }

// async function updateVacation(vacationSelected) {
//     const URL = URL_BASE + '/vacacion/modificarSolicitud'
//     const data = await hlp.getInputValues(dataInputs())

//     let response = hlp.errorHandler(data)

//     if (response.Header) {
//         msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
//     } else {
//         let newVacations = createVacationUpdateJson(response, vacationSelected.idVacaciones, "Aceptada")

//         let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newVacations)

//         if (apiResponse.response) {
//             loadVacationsModule(html)
//             msg.successMessage("Solicitud Actualizada", "La solicitud de vacaciones se actualizó con éxito")
//         } else {
//             msg.errorMessage("Error", "Hubo un error al actualizar la solicitud", "Por favor, vuelve a intentarlo.")
//         }
//     }
// }

// function modifyVacationsJson(json) {
//     let newJson = {
//         "idVacaciones": json.idVacaciones,
//         "nombre": json.empleado.persona.nombre,
//         "fechaSolicitud": json.fechaSolicitud,
//         "fechaInicio": json.fechaInicio,
//         "fechaFin": json.fechaFin,
//         "estatus": json.estatus
//     }

//     return newJson
// }

// async function getAllEmployees() {
//     const URL = URL_BASE + '/empleado/getAll'

//     const employees = await APIhlp.getAllData(URL)

//     return employees
// }

// async function getAllVacations() {
//     const URL = URL_BASE + '/vacacion/getAllSolicitudes'
//     const response = await APIhlp.getAllData(URL)

//     return response
// }

// // * Esta funcion obtiene todos los valores o datos desde un inicio para ahorrar recursos al cargar los componentes
// async function getAllData() {
//     const data = []
//     const employees = await getAllEmployees()
//     const vacations = await getAllVacations()

//     data.push(employees)
//     data.push(vacations)

//     return data
// }

// function dataInputs() {
//     const inputs = [
//         { selector: '#txtWeekStart', key: 'weekStart', name: "Inicio de Semana" },
//         { selector: '#txtWeekEnd', key: 'weekEnd', name: "Fin de Semana" }
//     ]

//     return inputs
// }

// function createVacationsJson(data, employeeSelected, status) {
//     const object = {
//         empleado: {
//             "idEmpleado": employeeSelected
//         },
//         "fechaInicio": data.weekStart,
//         "fechaFin": data.weekEnd,
//         "estatus": status
//     }

//     return object
// }

// function createVacationUpdateJson(data, vacationSelected, status) {
//     const object = {
//         "idVacaciones": vacationSelected,
//         "fechaInicio": data.weekStart,
//         "fechaFin": data.weekEnd,
//         "estatus": status
//     }

//     return object
// }

// function setFormValues(data) {
//     const dataToForm = [data.fechaInicio, data.fechaFin]

//     const inputs = dataInputs()

//     inputs.map((input, index) => {
//         let inputSelected = document.querySelector(input.selector)

//         inputSelected.value = dataToForm[index]
//     })
// }