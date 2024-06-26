import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

export function load(content) {
    const container = document.querySelector('#module-container')
    container.innerHTML = ''
    container.innerHTML = content

    loadControls()
}

async function loadControls() {
    const URL = URL_BASE + '/empleado/getAll'
    const btnSelectEmployee = document.querySelector('#btnSelectEmployee')
    const btnShowSelected = document.querySelector('#btnShowSelected')
    const btnSave = document.querySelector('#btnSave')
    const employees = await APIhlp.getAllData(URL)

    let employeeSelected = null

    btnSelectEmployee.addEventListener('click', () => {
        showPanel(index => {
            employeeSelected = index
        }, employees)
    })

    btnShowSelected.addEventListener('click', () => {
        if (employeeSelected != null) {
            msg.questionMessage("Empleado Seleccionado", `${employees[employeeSelected].persona.nombre} ${employees[employeeSelected].persona.apellidoPaterno} ${employees[employeeSelected].persona.apellidoMaterno}`)
        } else {
            msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
        }
    })

    btnSave.addEventListener('click', () => {
        if (employeeSelected != null) {
            const idSelected = employees[employeeSelected].idEmpleado
            sendAttendanceInformation(idSelected)
        } else {
            msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
        }
    })
}

function showPanel(onSelectEmployee, employees) {
    const panel = document.querySelector('.form-container')

    loadPanelControls()

    loadTable(employees, onSelectEmployee)

    panel.classList.toggle('form-active')
}

function loadPanelControls() {
    const btnBack = document.querySelector('#btnBack')

    btnBack.addEventListener('click', () => {
        const panel = document.querySelector('.form-container')
        panel.classList.remove('form-active')
    })
}

function loadTable(employees, onSelectEmployee) {
    const tableBody = document.querySelector('#employees-table');

    tableBody.innerHTML = "";

    employees.forEach((employee, index) => {
        let employeeRow = document.createElement('tr');
        let employeeName = document.createElement('th');
        let employeeLastName = document.createElement('th');
        let employeeRFC = document.createElement('th');
        let employeeNSS = document.createElement('th');

        employeeName.textContent = employee.persona.nombre;
        employeeLastName.textContent = `${employee.persona.apellidoPaterno} ${employee.persona.apellidoMaterno}`;
        employeeRFC.textContent = employee.persona.rfc;
        employeeNSS.textContent = employee.persona.nss;

        employeeRow.appendChild(employeeName);
        employeeRow.appendChild(employeeLastName);
        employeeRow.appendChild(employeeRFC);
        employeeRow.appendChild(employeeNSS);

        employeeRow.addEventListener('click', () => {
            const items = document.querySelectorAll('tr')
            items.forEach(item => {
                item.classList.remove('selected')
            })
            onSelectEmployee(index)
            addUpdateButton(index)
            employeeRow.classList.add('selected')
        });

        tableBody.appendChild(employeeRow);
    });
}

function addUpdateButton(employeeSelected) {
    const buttonContainer = document.querySelector('#button-container-attendance')
    let btnUpdateLastAttendance = document.querySelector('#btnUpdateLastAttendance')

    if (!btnUpdateLastAttendance) {
        btnUpdateLastAttendance = document.createElement('button')
        btnUpdateLastAttendance.classList.add('btn-base', 'button_update')
        btnUpdateLastAttendance.textContent = "Actualizar Ultima Asistencia"
        btnUpdateLastAttendance.id = 'btnUpdateLastAttendance'
        buttonContainer.appendChild(btnUpdateLastAttendance)
    }

    btnUpdateLastAttendance.replaceWith(btnUpdateLastAttendance.cloneNode(true))
    btnUpdateLastAttendance = document.querySelector('#btnUpdateLastAttendance')

    btnUpdateLastAttendance.addEventListener('click', () => updateLastAttendance(employeeSelected))
}

async function updateLastAttendance(employeeSelected) {
    const URL = URL_BASE + '/asistencia/modificarAsistencia'
    const URL_EMPLOYEES = URL_BASE + '/empleado/getAll'
    const data = await hlp.getInputValues(getAllInputs())
    const employees = await APIhlp.getAllData(URL_EMPLOYEES)
    let idEmployee = employees[employeeSelected].idEmpleado

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newAttendance = createAttendaceJson(response, idEmployee)

        let apiResponse = await APIhlp.saveObjectApiData(URL, "asistencia", newAttendance)

        if (apiResponse.response) {
            msg.successMessage("Asistencia Actualizada", "La asistencia se actualizo con éxito.")
        } else {
            msg.errorMessage("Error", "Hubo un error al actualizar la asistencia", "Por favor, vuelva a intentarlo.")
        }
    }
}

async function sendAttendanceInformation(employeeSelected) {
    const URL = URL_BASE + '/asistencia/registrarAsistencia'
    const data = await hlp.getInputValues(getAllInputs())

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newAttendance = createAttendaceJson(response, employeeSelected)

        let apiResponse = await APIhlp.saveObjectApiData(URL, "asistencia", newAttendance)

        if (apiResponse.response) {
            msg.successMessage("Asistencia Registrada", "La asistencia se registro con éxito.")
        } else {
            msg.errorMessage("Error", "Hubo un error al registrar la asistencia", "Por favor, vuelva a intentarlo.")
        }
    }
}

function getAllInputs() {
    const inputs = [
        { selector: '#txtWeekStart', key: 'inicioSemana', name: "Inicio de Semana" },
        { selector: '#txtWeekEnd', key: 'finSemana', name: "Fin de Semana" },
        { selector: '#txtDays', key: 'diasAsistidos', name: "Dias Asistidos" },
    ]
    return inputs
}

function createAttendaceJson(data, employeeSelected) {
    const object = {
        empleado: {
            "idEmpleado": employeeSelected,
        },
        "inicioSemana": data.inicioSemana,
        "finSemana": data.finSemana,
        "diasAsistidos": data.diasAsistidos
    }

    return object
}