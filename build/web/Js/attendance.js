import * as msg from './messages.js'

export function load(content) {
    const container = document.querySelector('#module-container')
    container.innerHTML = ''
    container.innerHTML = content

    loadControls()
}

function loadControls() {
    const btnSelectEmployee = document.querySelector('#btnSelectEmployee')
    const btnShowSelected = document.querySelector('#btnShowSelected')
    const btnSave = document.querySelector('#btnSave')

    let employeeSelected = null

    btnSelectEmployee.addEventListener('click', () => {
        showPanel(index => {
            employeeSelected = index
        })
    })

    btnShowSelected.addEventListener('click', () => {
        if (employeeSelected != null) {
            msg.questionMessage("Empleado Seleccionado", employees[employeeSelected].Nombre)
        } else {
            msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
        }
    })

    btnSave.addEventListener('click', () => {
        if (employeeSelected != null) {
            getFormInformation()
        } else {
            msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
        }
    })
}

function showPanel(onSelectEmployee) {
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

        employeeName.textContent = employee.Nombre;
        employeeLastName.textContent = employee.Apellidos;
        employeeRFC.textContent = employee.RFC;
        employeeNSS.textContent = employee.NSS;

        employeeRow.appendChild(employeeName);
        employeeRow.appendChild(employeeLastName);
        employeeRow.appendChild(employeeRFC);
        employeeRow.appendChild(employeeNSS);

        employeeRow.addEventListener('click', () => {
            const items = document.querySelectorAll('tr')
            items.forEach(item => {
                item.classList.remove('selected')
            })
            onSelectEmployee(index);
            employeeRow.classList.add('selected')
        });

        tableBody.appendChild(employeeRow);
    });
}

function getFormInformation() {
    const txtWeekStart = document.querySelector('#txtWeekStart').value
    const txtWeekEnd = document.querySelector('#txtWeekEnd').value
    const txtDays = document.querySelector('#txtDays').value

    if (txtWeekStart != '' || txtWeekEnd != '' || txtDays != '') {
        alert(txtWeekStart + " " + txtWeekEnd + " " + txtDays)
        // TODO: Enviar los datos mediante la API
    } else {
        msg.errorMessage("Campos Vacios", "Los campos no pueden estar vacios", "Rellene todos los campos del formulario")
    }
}

const employees = [
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