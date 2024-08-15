import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import * as cng from './config.js'
import * as cmp from './components.js'

let html
let data = []

export async function loadVacationsModule(content) {
    data = await getAllData();

    applyContentOnModule(content)

    loadEmployeesTable(data)

    loadEmployeeSelect(data) // Agrega los empleados al seleccionador de creador de la solicitud

    verityFileInputs()
}

function applyContentOnModule(content) {
    const moduleContainer = document.querySelector('#module-container')

    moduleContainer.innerHTML = content
}

function loadEmployeeSelect(data) {
    const slcInput = document.querySelector('#txtCreadtedBy')
    const employeesData = data[0]


    employeesData.forEach(employee => {
        const item = document.createElement('option')
        const name = `${employee.persona.nombre} ${employee.persona.apellidoPaterno} ${employee.persona.apellidoMaterno}`
        item.value = name
        item.text = name
        slcInput.appendChild(item)
    })
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
    const btnUpdateVacationsLeft = document.querySelector('#btnUpdateVacationsLeft')
    const btnUpdateVacationsLimit = document.querySelector('#btnUpdateVacationsLimit')

    if (!vacationsData.response) {
        vacationsData.map(vacation => {
            if (vacation.empleado.idEmpleado == idEmployee) {
                newVacationsList.push(vacation)
            }
            loadVacationsList(newVacationsList)
        })
    }

    changeEmployeeVacationsInfo(employeeData)
    changeDataFormInfo(employeeData, vacationsData)

    btnCreateRequest.onclick = () => createNewVacationRequest(idEmployee, employeeData)
    btnUpdateVacationsLeft.onclick = () => updateDaysLeft(idEmployee, employeeData)
    btnUpdateVacationsLimit.onclick = () => updateDaysLimit(idEmployee)

    updateFileButton()
    cleanForm()

    function loadVacationsList(vacationsData) {
        container.innerHTML = ''

        vacationsData.forEach((vacation, index) => {
            const item = createVacationItem(vacation)
            item.onclick = () => {
                updateRequest(vacation)
                loadVacationInfo(vacation)
            }
            container.appendChild(item)
        })
    }
}

function loadVacationInfo(vacationData) {
    const labels = document.querySelectorAll('.info-request-container small')
    const btnShowSupportDocument = document.querySelector('#btnShowSupportDocument')

    const dateRequestLabel = labels[0].textContent = `${vacationData.fechaSolicitud}`
    const timeRangeRequest = labels[1].textContent = `${vacationData.fechaInicio} -> ${vacationData.fechaFin} (${getDays(vacationData.fechaInicio, vacationData.fechaFin)} dias)`
    const createdBy = labels[2].textContent = `${vacationData.nombreCreador}`
    const checkedBy = labels[3].textContent = `${vacationData.nombreAprobador!=undefined?vacationData.nombreAprobador : "No atendida"}`
    const creatorComments = labels[4].textContent = `${vacationData.comentariosCreador}`
    const employeeComments = labels[5].textContent = `${vacationData.comentariosEmpleado}`

    if (vacationData.documentoSoporte != '') {
        btnShowSupportDocument.onclick = () => msg.showFrame(vacationData.documentoSoporte)
    } else {
        btnShowSupportDocument.onclick = () => {
            msg.questionMessage(
                "Sin Documento",
                "Esta solicitud no contiene un documento adicional."
            )
        }
    }
}

function changeEmployeeVacationsInfo(data) {
    const image = document.querySelector('.circle-vacations-info img')
    const vacationsLeft = document.querySelector('.circle-vacations-info h2 b')
    const vacationsLimit = document.querySelectorAll('.circle-vacations-info small')

    image.src = data.foto // Asignamos la foto
    vacationsLeft.textContent = `${data.vacacionesRestantes} dias` // Asignamos las vacaciones restantes
    vacationsLimit[1].textContent = `de ${data.limiteVacaciones} dias` // Asignamos el limite de vacaciones
}

function changeDataFormInfo(employeeData, vacationsData) {
    const date = employeeData.antiguedad
    const employeeTime = getTimeInYears(date)
    const request = filterEmployeeVacations()
    const todayDate = getTodayDate()

    const labels = document.querySelectorAll('.form-small-info small')
    const dateLabel = labels[0]
    const lastRequest = labels[1]

    dateLabel.textContent = `${date} (${employeeTime.years} años, ${employeeTime.months} meses)`

    if (request != null) {
        if (request.length <= 0) {
            lastRequest.textContent = `No hay solicitudes`
        } else {
            lastRequest.textContent = `${request[request.length - 1].fechaSolicitud} (Hace ${getDays(request[0].fechaSolicitud, todayDate)} dias)`
        }
    }

    function filterEmployeeVacations() {
        if (!vacationsData.response) {
            const employeeRequests = vacationsData.filter(request =>
                request.empleado.idEmpleado == employeeData.idEmpleado
            )
            return employeeRequests
        }
        return null
    }
}

function createVacationItem(data) {
    const item = document.createElement('div')
    item.classList.add('vacations-info_item', 'border-bottom', 'py-3')

    const firstRow = document.createElement('div')
    firstRow.classList.add('d-flex', 'justify-content-between', 'pointer')

    const spanInfo = document.createElement('span')
    spanInfo.classList.add('text-dark', 'mx-1')
    spanInfo.textContent = `${data.fechaInicio} - ${data.fechaFin} (${getDays(data.fechaInicio, data.fechaFin)} dias solicitados)`

    const spanStatus = document.createElement('span')
    if (data.estatus == 'aprobado') {
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

async function updateRequest(vacationData) {
   // Validar la longitud de los inputs antes de continuar
    if (!validarGetAllRequestInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
    const URL = cng.URL_BASE + '/vacacion/actualizarEstatus'
    const btnUpdateRequest = document.querySelector('#btnUpdateRequest')

    btnUpdateRequest.onclick = async function () {
        const response = await msg.showForm(data[0])
        const object = { idVacaciones: vacationData.idVacaciones, estatus: response.estado, nombreAprobador: response.aprobador }

        let apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', object)
        if (apiResponse.response == 'OK') {
            msg.successMessage("Solicitud actualizada.")
            updateRequestStatusOnEmployee(object.idVacaciones, object.estatus, object.nombreAprobador)
        } else {
            const serverMessage = hlp.handlerApiResponse(apiResponse, 'Error al actualizar la solicitud', 'Ocurrió un error. Por favor, vuelve a intentarlo más tarde.')
            msg.errorMessage('Error al procesar la solicitud', serverMessage)
        }
    }
}

async function updateDaysLeft(idEmployee, employeeData) {
      // Validar la longitud de los inputs antes de continuar
    if (!validarGetAllRequestInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
    const VACATIONS_LIMIT = employeeData.limiteVacaciones
    const VACATIONS_LEFT = employeeData.vacacionesRestantes
    parseInt(VACATIONS_LIMIT, 10)
    parseInt(VACATIONS_LEFT, 10)
    const URL = cng.URL_BASE + '/vacacion/actualizarCantidadVacaciones'
    const inputs = [{ selector: '#txtVacationsLeft', key: 'vacacionesRestantes', name: "Vacaciones Restantes", required: true }]
    const data = await hlp.getInputValues(inputs)

    let response = hlp.errorHandler(data)
    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        if (parseInt(data.vacacionesRestantes, 10) < 0) {
            msg.errorMessage('Cantidad no valida', 'La canttidad no debe de ser negativa', 'Ingresa otro numero')
        } else {
            if (parseFloat(data.vacacionesRestantes, 10) <= VACATIONS_LIMIT) {
                const employeeObj = { idEmpleado: idEmployee, vacacionesRestantes: data.vacacionesRestantes }
                const apiResponse = await APIhlp.saveObjectApiData(URL, 'empleado', employeeObj)

                if (apiResponse.response == 'OK') {
                    msg.successMessage('La cantidad se actualizó correctamente.')
                    updateVacationsLeftOnEmployee(idEmployee, employeeObj.vacacionesRestantes)
                } else {
                    const serverMessage = hlp.handlerApiResponse(apiResponse, 'Error al actualizar la cantidad', 'Ocurrió un error. Por favor, vuelve a intentarlo más tarde.')
                    msg.errorMessage('Error al procesar la solicitud', serverMessage)
                }
            } else {
                msg.errorMessage('Límite no permitido', 'La cantidad ingresada supera el límite.', 'Ingresa una cantidad menor o igual a ' + VACATIONS_LIMIT)
            }
        }
    }
}

async function updateDaysLimit(idEmployee) {
       // Validar la longitud de los inputs antes de continuar
    if (!validarGetAllRequestInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
    const inputs = [{ selector: '#txtVacationsLimit', key: 'limiteVacaciones', name: "Limite de vacaciones", required: true }]
    const data = await hlp.getInputValues(inputs)
    const URL = cng.URL_BASE + '/vacacion/actualizarLimiteVacaciones'

    let response = hlp.errorHandler(data)
    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        if (parseInt(data.limiteVacaciones, 10) < 0) {
            msg.errorMessage('Límite no válido', 'El límite no debe ser negativo.', 'Ingresa otro número.')
        } else {
            const employeeObj = { idEmpleado: idEmployee, limiteVacaciones: parseInt(data.limiteVacaciones, 10) }
            const apiResponse = await APIhlp.saveObjectApiData(URL, 'empleado', employeeObj)

            if (apiResponse.response == 'OK') {
                msg.successMessage('El límite se actualizó correctamente.')
                updateVacationsLimitOnEmployee(idEmployee, employeeObj.limiteVacaciones)
            } else {
                const serverMessage = hlp.handlerApiResponse(apiResponse, 'Error al actualizar el límite', 'Ocurrió un error. Por favor, vuelve a intentarlo más tarde.')
                msg.errorMessage('Error al procesar la solicitud', serverMessage)
            }
        }
    }
}

async function createNewVacationRequest(idEmpleado, employeeData) {
           // Validar la longitud de los inputs antes de continuar
    if (!validarGetAllRequestInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
    const data = await hlp.getInputValues(getAllRequestInputs())
    const VACATIONS_LIMIT = employeeData.limiteVacaciones
    const VACATIONS_LEFT = employeeData.vacacionesRestantes
    parseInt(VACATIONS_LIMIT, 10)
    parseInt(VACATIONS_LEFT, 10)
    const URL = cng.URL_BASE + '/vacacion/insertSolicitud'

    let response = hlp.errorHandler(data)

    const diasSolicitados = getDays(response.fechaInicio, response.fechaFin)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        if (verifyDate(response.fechaInicio, response.fechaFin)) {
            if (diasSolicitados > VACATIONS_LIMIT || diasSolicitados > VACATIONS_LEFT) {
                msg.errorMessage(
                    'Límite Excedido',
                    'Los días solicitados superan el límite permitido o las vacaciones disponibles.',
                    'Por favor, selecciona otras fechas.'
                );
            } else {
                const newRequest = createJsonRequest(response, idEmpleado)
                const apiResponse = await APIhlp.saveObjectApiData(URL, 'vacacion', newRequest)
                if (apiResponse.response === 'OK') {
                    msg.successMessage('La solicitud se ha creado con éxito.')
                    addRequestOnEmployee(idEmpleado, newRequest)
                } else {
                    const serverMessage = hlp.handlerApiResponse(apiResponse, 'Error al crear la solicitud', 'Ocurrió un error. Por favor, vuelve a intentarlo más tarde.')
                    msg.errorMessage('Error al procesar la solicitud', serverMessage)
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

    supportInput.addEventListener('change', function (event) {
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
        { selector: '#txtStartVacations', key: 'fechaInicio', name: "Fecha de inicio", required: true },
        { selector: '#txtEndVacations', key: 'fechaFin', name: "Fecha de fin", required: true },
        { selector: '#txtCreadtedBy', key: 'nombreCreador', name: "Nombre del creador de la solicitud", required: true },
        { selector: '#txtCommentsC', key: 'comentariosCreador', name: "Comentarios del creador", required: true },
        { selector: '#txtCommentsE', key: 'comentariosEmpleado', name: "Comentarios del empleado", required: true },
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
        "nombreCreador": data.nombreCreador,
        "diasSolicitados": getDays(data.fechaInicio, data.fechaFin),
        "comentariosCreador": data.comentariosCreador,
        "comentariosEmpleado": data.comentariosEmpleado,
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

function getTimeInYears(inputDate) {
    const nodawaysDate = new Date()

    const startDate = new Date(inputDate)

    let years = nodawaysDate.getFullYear() - startDate.getFullYear()
    let months = nodawaysDate.getMonth() - startDate.getMonth()

    if (months < 0) {
        years--
        months += 12
    }

    return { years, months }
}

function getTodayDate() {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

function addRequestOnEmployee(idEmployee, requestInfo) {
    const requestData = data[1] // Index de las solicitudes en el array global
    const employeeData = data[0] // Index de los empleados en el array global
    const LAST_REQUEST_ID = requestData.length > 0 && requestData[0].idVacaciones !== undefined ? requestData[0].idVacaciones : 0

    substractDaysLeftOnEmployee(idEmployee, requestInfo.diasSolicitados)
    createNewJsonRequest(LAST_REQUEST_ID, idEmployee, requestInfo)
}

function substractDaysLeftOnEmployee(idEmployee, daysToSubstract) {
    const EMPLOYEE_DATA_INDEX = 0

    const employee = data[EMPLOYEE_DATA_INDEX].find(emp => emp.idEmpleado === idEmployee)

    if (employee) {
        employee.vacacionesRestantes -= daysToSubstract

        if (employee.vacacionesRestantes < 0) {
            employee.vacacionesRestantes = 0
        }

    } else {
        alert("Empleado no encontrado")
    }

    loadEmployeesTable(data)
}

function createNewJsonRequest(lastRequestId, idEmployee, requestInfo) {
    const EMPLOYEE_DATA_INDEX = 0

    const employee = data[EMPLOYEE_DATA_INDEX].find(emp => emp.idEmpleado === idEmployee)

    const newRequestJson = {
        "idVacaciones": lastRequestId + 1,
        "empleado": {
            "idEmpleado": employee.idEmpleado,
            "persona": {
                "idPersona": employee.persona.idPersona,
                "apellidoPaterno": employee.persona.apellidoPaterno,
                "apellidoMaterno": employee.persona.apellidoMaterno
            },
            "antiguedad": "2024-08-12",
            "limiteVacaciones": employee.limiteVacaciones,
            "vacacionesRestantes": employee.vacacionesRestantes
        },
        "fechaSolicitud": getTodayDate(),
        "fechaInicio": requestInfo.fechaInicio,
        "fechaFin": requestInfo.fechaFin,
        "diasSolicitados": requestInfo.diasSolicitados,
        "estatus": "pendiente",
        "nombreCreador": requestInfo.nombreCreador,
        "comentariosCreador": requestInfo.comentariosCreador,
        "vacacionesRestantes": employee.vacacionesRestantes,
        "comentariosEmpleado": requestInfo.comentariosEmpleado,
        "documentoSoporte": requestInfo.documentoSoporte && requestInfo.documentoSoporte != undefined ? requestInfo.documentoSoporte : ""
    }

    try {
        if (!Array.isArray(data[1])) {
            data[1] = []
        }

        data[1].push(newRequestJson)

        if (data[1].length > 0) {
            data[1].sort((a, b) => b.idVacaciones - a.idVacaciones)
        }

    } catch (error) {
        console.log(error)
    }

    loadEmployeesTable(data)

    targetEmployeeData(idEmployee, data[1], employee)
}

function updateVacationsLimitOnEmployee(idEmployee, newLimit) {
    const EMPLOYEE_DATA_INDEX = 0

    const employee = data[EMPLOYEE_DATA_INDEX].find(emp => emp.idEmpleado == idEmployee)

    if (employee) {
        employee.limiteVacaciones = newLimit
    } else {
        msg.errorMessage('Error al acutalizar los datos locales', 'No se encontro al empleado', 'vuelva a cargar la pagina actual')
    }

    loadEmployeesTable(data)

    targetEmployeeData(idEmployee, data[1], employee)
}

function updateVacationsLeftOnEmployee(idEmployee, newDays) {
    const EMPLOYEE_DATA_INDEX = 0

    const employee = data[EMPLOYEE_DATA_INDEX].find(emp => emp.idEmpleado == idEmployee)

    if (employee) {
        employee.vacacionesRestantes = newDays
    } else {
        msg.errorMessage('Error al acutalizar los datos locales', 'No se encontro al empleado', 'vuelva a cargar la pagina actual')
    }

    loadEmployeesTable(data)

    targetEmployeeData(idEmployee, data[1], employee)
}

function updateRequestStatusOnEmployee(idRequest, requestStatus, name) {
    const REQUEST_DATA_INDEX = 1
    const EMPLOYEE_DATA_INDEX = 0

    const request = data[REQUEST_DATA_INDEX].find(request => request.idVacaciones == idRequest)
    const employee = data[EMPLOYEE_DATA_INDEX].find(emp => request.empleado.idEmpleado == emp.idEmpleado)

    if (request) {
        request.estatus = requestStatus
        request.nombreAprobador = name
        request.fechaRespondido = getTodayDate()
    } else {
        msg.errorMessage('Error al acutalizar los datos locales', 'No se pudo actualizar los datos de la solicitud', 'Vuelva a cargar la pagina actual')
    }

    const newDays = request.estatus == 'aprobado' ? employee.vacacionesRestantes : employee.vacacionesRestantes + request.diasSolicitados

    updateVacationsLeftOnEmployee(employee.idEmpleado, newDays)
    loadVacationInfo(request)
}

// validar inputs
function validarLongitudInput(valorInput, longitudMaxima) {
    return valorInput.length <= longitudMaxima;
}

function validarGetAllRequestInputs() {
    const inputs = getAllRequestInputs();
    let esValido = true;

    inputs.forEach(input => {
        const valorInput = document.querySelector(input.selector).value;

        // Validar según el campo específico
        switch (input.key) {
            case 'nombreCreador':
            case 'nombreAprobador':
            case 'comentariosCreador':
            case 'comentariosEmpleado':
                if (!validarLongitudInput(valorInput, 255)) {
                    esValido = false;
                    msg.errorMessage("Error", "Por favor, vuelva a intentarlo.", `El campo '${input.name}' debe contener menos de 255 caracteres.`);
                }
                break;
            case 'estatus':
                if (!validarLongitudInput(valorInput, 100)) {
                    esValido = false;
                    msg.errorMessage("Error", "Por favor, vuelva a intentarlo.", `El campo '${input.name}' debe contener menos de 100 caracteres.`);
                }
                break;
            default:
                break;
        }
    });

    return esValido;
}
