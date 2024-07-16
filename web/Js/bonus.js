import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

export function loadBonusModule(content) {
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
    const btnShowPay = document.querySelector('#btnShowPay')
    const btnSaveData = document.querySelector('#btnSave')
    let employees = await getAllEmployees()
    await getAllTotal();

    let employeeSelected = null

    addFunctionToElement(() => openPanel(index => { employeeSelected = index }, employees), btnSelectEmployee)
    addFunctionToElement(() => showEmployeeSelected(employeeSelected, employees), btnShowSelected)
    addFunctionToElement(() => showPaySelected(employeeSelected, employees), btnShowPay)
    addFunctionToElement(() => saveBonusData(employeeSelected), btnSaveData)
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

async function showPaySelected(employeeSelected, employees) {
    if (employeeSelected != null) {
        let employeeInfo = employees.filter(empleado => empleado.idEmpleado === employeeSelected);

        if (employeeInfo.length > 0) {
            try {
                let pagos = await getAllBonus(employeeSelected);
                let resultadoAguialdo = pagos[0].cantidadAguinaldo;
                msg.questionMessage("Ultimo pago", `${employeeInfo[0].persona.nombre} ${employeeInfo[0].persona.apellidoPaterno} ${employeeInfo[0].persona.apellidoMaterno} El total es: ${resultadoAguialdo}`);
            } catch (error) {
                console.error('Error al obtener los pagos:', error);
                msg.errorMessage("Error al obtener pagos", "Hubo un problema al obtener los pagos del empleado.", "Intenta nuevamente más tarde.");
            }
        } else {
            msg.errorMessage("Empleado no encontrado", "El empleado seleccionado no está en la lista.", "Por favor, selecciona otro empleado.");
        }
    } else {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    }
}



    async function getAllEmployees() {
        const URL = URL_BASE + '/empleado/getAll'

        const employees = await APIhlp.getAllData(URL)

        return employees
    }



  async function saveBonusData(employeeSelected) {
    if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado antes de registrar el pago.");
        return;
    }

    const URL = URL_BASE + '/aguinaldo/calcularAguinaldo';


        try {
          
                let pay = createBonusJson( employeeSelected);
                
                let resultado = await APIhlp.saveObjectApiData(URL, "aguinaldo", pay);
                
                if (resultado) {
                    msg.successMessage("Pago Registrado", "El pago se registró con éxito.");
                    
                    // Obtener los pagos del empleado seleccionado
                    let pagos = await getAllBonus(employeeSelected);
                    let resultadoAguinaldo = pagos[0].cantidadAguinaldo;

                    // Mostrar el total a pagar
                    msg.questionMessage("Total a pagar", `El total a pagar es: ${resultadoAguinaldo}`);

                } else {
                    msg.errorMessage("Error", "Hubo un error al registrar el pago", "Por favor, vuelva a intentarlo.");
                }
            
        } catch (error) {
            console.error('Error en la solicitud:', error);
            msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
        }
                    await getAllTotal();
   
}

    
   



    function createBonusJson(employeeSelected) {
        const object = {
            empleado: {
                "idEmpleado": employeeSelected,
            }
        };

        return object;
    }

    // funcion para mostrar en la alerta despues de pulsar

    async function getAllBonus(employeeSelected) {
        const URL = URL_BASE + '/aguinaldo/getAll?idEmpleado=' + employeeSelected;

        const pagos = await APIhlp.getAllData(URL);

        return pagos;
    }


  // getAll para todos lo pagos:
  
 async function getAllTotal() {
    const URL = URL_BASE + '/aguinaldo/getAllTotal';

    try {
        let total = await APIhlp.getAllData(URL);
        document.getElementById('txtTotal').value = total[0].total;
    } catch (error) {
        console.error('Error al obtener el total:', error);
        alert('Hubo un problema al obtener el total. Por favor, inténtalo nuevamente.');
    }
}



