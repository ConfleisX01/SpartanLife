import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

let html = null

// ? Funcion para cargar el modulo entero desde el menu
export async function loadModule(content) {
    html = content
    const BRANCH_URL = URL_BASE + '/sucursal/getAll'
    const JOB_URL = URL_BASE + '/puesto/getAll'
    const URL = URL_BASE + '/empleado/getAll'
    const branchs = await APIhlp.getAllData(BRANCH_URL)
    const jobs = await APIhlp.getAllData(JOB_URL)
    const data = await APIhlp.getAllData(URL)
    applyContentOnModule(content)
    
    loadControls(branchs, jobs)
    loadTable(data, branchs, jobs)

    verifyInputFiles()
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

            employeeItem.removeEventListener('click', async () => {
                if (!form.classList.contains('form-active') || !form.classList.contains('form-empty')) {
                    loadEmployeeData(data, index, branchs, jobs)
                } else {
                    const response = await msg.confirmMessage("No se puede realizar esta accion", "Ciera el formulario antes de acceder a otro", "Cerrar Formulario")
                    if (response) {
                        closeForm()
                    }
                }
            })

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
    // const fileButtons = document.querySelectorAll('.item-added_form')

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

    // const fileDocuments = {
    //     "photo": employee.foto,
    //     "ine": employee.documento.documentoIne,
    //     "comprobante": employee.documento.documentoDomicilio,
    //     "curp": employee.documento.documentoCurp,
    //     "contrato": employee.documento.documentoContrato
    // }

    // let arrayDocuments = Object.values(fileDocuments)

    // * Cargamos los datos del empleado en el formulario para modificarlos
    updateFileButton()

    let object = objectToFillForm(employee)

    // for (let i = 0; i < fileButtons.length; i++) {
    //     let type = arrayDocuments[i].startsWith('data:image') ? 'image/*' : 'application/pdf'

    //     setFileViewer(arrayDocuments[i], fileButtons[i], type, true)
    // }

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
    updateFileButton()

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

    branchSelect.innerHTML = ''
    jobSelect.innerHTML = ''

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

    //btnBack.removeEventListener('click', closeForm)
    //btnBack.addEventListener('click', closeForm)
    btnBack.onclick = () => closeForm()

    if (btnUpdate != null) {
        //btnUpdate.removeEventListener('click', () => updateEmployee(employee))
        //btnUpdate.addEventListener('click', () => updateEmployee(employee))
        btnUpdate.onclick = () => updateEmployee(employee)
    }

    if (btnSave != null) {
        //btnSave.removeEventListener('click', saveEmployee)
        //btnSave.addEventListener('click', saveEmployee)
        btnSave.onclick = saveEmployee
    }

    //btnDelete.removeEventListener('click', () => deleteEmployee(employee))
    //btnDelete.addEventListener('click', () => deleteEmployee(employee))
    btnDelete.onclick = () => deleteEmployee(employee)

    console.log("Nuevas funciones corregidas")
}

// ? Funcion para limpiar el formulario en caso de ser necesario
function cleanForm() {
    let inputs = document.querySelectorAll('input')

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
            loadModule(html)
        } else {
            msg.errorMessage("Error", "Hubo un error al actualizar el empleado", "Por favor, vuelve a intentarlo.")
        }
    }
}

async function deleteEmployee(employee) {
    const data = await hlp.getInputValues(getAllInputs())
    const URL = URL_BASE + '/empleado/eliminarEmpleado'

    const response = await msg.confirmMessage("Estas Seguro?", "La eliminacion de un empleado no se puede revertir", "Eliminar Empleado")

    if (response) {
        let newEmployee = createEmployeeJsonToUpdate(data, employee.persona.idPersona, employee.idEmpleado)

        let apiResponse = await APIhlp.saveObjectApiData(URL, "empleado", newEmployee)

        if (apiResponse.response) {
            msg.successMessage("Empleado Eliminado", "El emplado ha sido eliminado con éxito")
            loadModule(html)
        } else {
            msg.errorMessage("Error", "Hubo un error al eliminar el empleado", "Por favor, vuelve a intentarlo.")
        }
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
            loadModule(html)
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
        documento: {
            "documentoIne": data.documentoIne,
            "documentoDomicilio": data.documentoDomicilio,
            "documentoCurp": data.documentoCurp,
            "documentoContrato": data.documentoContrato
        },
        "foto": data.foto,
        "limiteVacaciones": data.limiteVacaciones,
        "antiguedad": data.antiguedad
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
        documento: {
            "documentoIne": data.documentoIne,
            "documentoDomicilio": data.documentoDomicilio,
            "documentoCurp": data.documentoCurp,
            "documentoContrato": data.documentoContrato
        },
        "foto": data.foto,
        "limiteVacaciones": data.limiteVacaciones,
        "idEmpleado": idEmployee,
        "antiguedad": data.antiguedad
    }

    return employee
}

function objectToFillForm(data) {
    const newObject = {
        foto: data.foto,
        documentoIne: data.documento.documentoIne,
        documentoDomicilio: data.documento.documentoDomicilio,
        documentoCurp: data.documento.documentoCurp,
        documentoContrato: data.documento.documentoContrato,
        nombre: data.persona.nombre,
        apellidoPaterno: data.persona.apellidoPaterno,
        apellidoMaterno: data.persona.apellidoMaterno,
        fechaNacimiento: data.persona.fechaNacimiento,
        puesto: data.puesto.idPuesto,
        rfc: data.persona.rfc,
        curp: data.persona.curp,
        nss: data.persona.nss,
        sucursal: data.sucursal.idSucursal,
        antiguedad: data.antiguedad,
        limiteVacaciones: data.limiteVacaciones
    }

    return newObject
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtFileConvertedPhoto', key: 'foto', name: "Foto", required: true },
        { selector: '#txtFileConvertedIne', key: 'documentoIne', name: "Documento INE", required: true },
        { selector: '#txtFileConvertedHouse', key: 'documentoDomicilio', name: "Comprobante de Domicilio", required: true },
        { selector: '#txtFileConvertedCurp', key: 'documentoCurp', name: "Documento CURP", required: true },
        { selector: '#txtFileConvertedWork', key: 'documentoContrato', name: "Contrato Laboral", required: true },
        { selector: '#txtName', key: 'nombre', name: "Nombre", required: true },
        { selector: '#txtFirstLastName', key: 'apellidoPaterno', name: "Apellido Paterno", required: true },
        { selector: '#txtSecondLastName', key: 'apellidoMaterno', name: "Apellido Materno", required: true },
        { selector: '#txtBornDate', key: 'fechaNacimiento', name: "Fecha de nacimiento", required: true },
        { selector: '#txtJob', key: 'puesto', name: "Puesto", required: true },
        { selector: '#txtRFC', key: 'rfc', name: "RFC", required: true },
        { selector: '#txtCURP', key: 'curp', name: "CURP", required: true },
        { selector: '#txtNSS', key: 'nss', name: "NSS", required: true },
        { selector: '#txtBranch', key: 'sucursal', name: "Sucursal", required: true },
        { selector: '#txtRegisterDate', key: 'antiguedad', name: "Fecha de registro", required: true },
        { selector: '#txtVacationsLimit', key: 'limiteVacaciones', name: "Limite de vacaciones", required: true }
    ]
    return inputs
}

function verifyInputFiles() {
    const FIRST_FILE = 0
    const MAX_FILE_SIZE = 5

    let inputPhoto = document.querySelector('#txtFoto').addEventListener('change', function (event) {
        const PHOTO_ITEM_INDEX = 0
        const file = event.target.files[FIRST_FILE]

        vefiryFile(file, 'image/*', PHOTO_ITEM_INDEX)
    })

    let inputIne = document.querySelector('#txtDocumentINE').addEventListener('change', function (event) {
        const INE_ITEM_INDEX = 1
        const file = event.target.files[FIRST_FILE]

        vefiryFile(file, 'application/pdf', INE_ITEM_INDEX)
    })

    let inputHouse = document.querySelector('#txtDocumentHouse').addEventListener('change', function (event) {
        const HOUSE_ITEM_INDEX = 2
        const file = event.target.files[FIRST_FILE]

        vefiryFile(file, 'application/pdf', HOUSE_ITEM_INDEX)
    })

    let inputCurp = document.querySelector('#txtDocumentCURP').addEventListener('change', function (event) {
        const CURP_ITEM_INDEX = 3
        const file = event.target.files[FIRST_FILE]

        vefiryFile(file, 'application/pdf', CURP_ITEM_INDEX)
    })

    let inputWork = document.querySelector('#txtDocumentWork').addEventListener('change', function (event) {
        const WORK_ITEM_INDEX = 4
        const file = event.target.files[FIRST_FILE]

        vefiryFile(file, 'application/pdf', WORK_ITEM_INDEX)
    })

}

function vefiryFile(file, mime, indexItem) {
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
    const photoHolder = document.querySelector('#txtFileConvertedPhoto')
    const ineHolder = document.querySelector('#txtFileConvertedIne')
    const houseHolder = document.querySelector('#txtFileConvertedHouse')
    const curpHolder = document.querySelector('#txtFileConvertedCurp')
    const workHolder = document.querySelector('#txtFileConvertedWork')
    const inputsArray = []

    inputsArray.push(photoHolder)
    inputsArray.push(ineHolder)
    inputsArray.push(houseHolder)
    inputsArray.push(curpHolder)
    inputsArray.push(workHolder)

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