import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

export function loadPaysModule(content) {
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
    const btnUpdateData = document.querySelector('#btnUpdate')
    let employees = await getAllEmployees()
    await getAllTotal();

    let employeeSelected = null

    addFunctionToElement(() => openPanel(index => { employeeSelected = index }, employees), btnSelectEmployee)
    addFunctionToElement(() => showEmployeeSelected(employeeSelected, employees), btnShowSelected)
    addFunctionToElement(() => showPaySelected(employeeSelected, employees), btnShowPay)
    addFunctionToElement(() => savePayData(employeeSelected), btnSaveData)
    addFunctionToElement(() => updatePayData(employeeSelected), btnUpdateData)
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
                let pagos = await getAllPay(employeeSelected);
                let resultadoSalario = pagos[0].cantidadPago;
                msg.questionMessage("Ultimo pago", `${employeeInfo[0].persona.nombre} ${employeeInfo[0].persona.apellidoPaterno} ${employeeInfo[0].persona.apellidoMaterno} El total es: ${resultadoSalario}`);
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



  async function savePayData(employeeSelected) {
    if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado antes de registrar el pago.");
        return;
    }

    const URL = URL_BASE + '/salario/calcularSalario';
    const inputsValues = await hlp.getInputValues(getAllInputs());

    if (validarNumerosEnteros()) {
        try {
            if (inputsValues != null) {
                let pay = createPayJson(inputsValues, employeeSelected);
                
                let resultado = await APIhlp.saveObjectApiData(URL, "pago", pay);
                
                if (resultado) {
                    msg.successMessage("Pago Registrado", "El pago se registró con éxito.");
                    
                    // Obtener los pagos del empleado seleccionado
                    let pagos = await getAllPay(employeeSelected);
                    let resultadoSalario = pagos[0].cantidadPago;

                    // Mostrar el total a pagar
                    msg.questionMessage("Total a pagar", `El total a pagar es: ${resultadoSalario}`);

                    await getAllTotal();
                } else {
                    msg.errorMessage("Error", "Hubo un error al registrar el pago", "Por favor, vuelva a intentarlo.");
                }
            } else {
                msg.errorMessage("Error", "Hubo un error al obtener los valores de los inputs", "Por favor, vuelva a intentarlo.");
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
        }
    } else {
        msg.errorMessage("Error", "Datos erróneos, solo se permiten números enteros", "Por favor, vuelva a intentarlo.");
    }
}

    
   async function updatePayData(employeeSelected) {
    if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado antes de modificar el pago.");
        return;
    }

    const URL = URL_BASE + '/salario/modificarSalario';
    const inputsValues = await hlp.getInputValues(getAllInputs());
    if (validarNumerosEnteros()) {
        try {
            if (inputsValues != null) {
                let pay = createPayJson(inputsValues, employeeSelected);
                
                let resultado = await APIhlp.saveObjectApiData(URL, "pago", pay);
                
                if (resultado) {
                    msg.successMessage("Pago Modificado", "El pago se modificó con éxito.");
                    
                    // Obtener los pagos del empleado seleccionado
                    let pagos = await getAllPay(employeeSelected);
                    let resultadoSalario = pagos[0].cantidadPago;

                    // Mostrar el total a pagar
                    msg.questionMessage("Total a pagar", `El total a pagar es: ${resultadoSalario}`);

                await getAllTotal();
                } else {
                    msg.errorMessage("Error", "Hubo un error al modificar el pago", "Por favor, vuelva a intentarlo.");
                }
            } else {
                msg.errorMessage("Error", "Hubo un error al obtener los valores de los inputs", "Por favor, vuelva a intentarlo.");
            }
        } catch (error) {
            console.error('Error en la solicitud:', error);
            msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
        }
    } else {
        msg.errorMessage("Error", "Datos erróneos, solo se permiten números enteros", "Por favor, vuelva a intentarlo.");
    }
}


    

    function getAllInputs() {
        const inputs = [
            { selector: '#txtHoraNormal', key: 'horaNormal' },
            { selector: '#txtHoraExtra', key: 'horaExtra' }
        ]
        return inputs
    }

    function createPayJson(data, employeeSelected) {
        const object = {
            empleado: {
                "idEmpleado": employeeSelected,
            },
            "horaExtra": {
                "cantidadHora": parseInt(data.horaExtra)
            },
              "horaTrabajada": parseInt(data.horaNormal)
        };

        return object;
    }

    // funcion para mostrar en la alerta despues de pulsar

    async function getAllPay(employeeSelected) {
        const URL = URL_BASE + '/salario/getAll?idEmpleado=' + employeeSelected;

        const pagos = await APIhlp.getAllData(URL);

        return pagos;
    }


  // getAll para todos lo pagos:
  
 async function getAllTotal() {
    const URL = URL_BASE + '/salario/getAllTotal';

    try {
        let total = await APIhlp.getAllData(URL);
        document.getElementById('txtTotal').value = total[0].total;
    } catch (error) {
        console.error('Error al obtener el total:', error);
        alert('Hubo un problema al obtener el total. Por favor, inténtalo nuevamente.');
    }
}


// eliminar todo lo que no sea numeros en hora extra con expresiones regulares
function validarNumerosEnteros() {
    
    let datoNormal = document.getElementById('txtHoraNormal').value;
    let datoExtra = document.getElementById('txtHoraExtra').value;
    let revisar = /^\d+$/;

    if (revisar.test(datoNormal) && revisar.test(datoExtra)) {
        return true;
    } else {
        return false;
    }
}
