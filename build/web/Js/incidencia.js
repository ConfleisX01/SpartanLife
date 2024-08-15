import * as msg from './messages.js';
import * as hlp from './helpers.js';
import * as APIhlp from './APIHelpers.js';
import { URL_BASE } from './config.js';
import * as cmp from './components.js';

let html;

export function loadIncidenciasModule(content) {
    applyContentOnModule(content);
    loadModuleControls();
    html = content;
}

function applyContentOnModule(content) {
    const moduleContainer = document.querySelector('#module-container');
    moduleContainer.innerHTML = content;
}

async function loadModuleControls() {
    const data = await getAllData();
    const employees = data[0];

    let employeeSelected = null;

    function updateEmployeeSelected(newData) {
        employeeSelected = newData;
        // Llama a showIncidenciaSelected después de seleccionar un empleado
        showIncidenciaSelected(employeeSelected.idEmpleado, employees);
    }

    loadPanelControls();
    updateAlertStatus();

    const buttonSelectEmployee = document.querySelector('#btnSelectEmployee');
    buttonSelectEmployee.addEventListener('click', () => selectEmployee(employees, updateEmployeeSelected));

    const buttonSave = document.querySelector('#btnSave');
    buttonSave.addEventListener('click', () => saveIncidencia(employeeSelected));
    
        const buttonUpdate = document.querySelector('#btnUpdate');
    buttonUpdate.addEventListener('click', () => updateIncidencia(employeeSelected));
}

function selectEmployee(content, updateEmployeeSelected) {
    setPanelContent(content, updateEmployeeSelected);
    modifyPanelTitles('Selección de Empleados', 'Selecciona un empleado para registrar una incidencia');
    togglePanelVisibility();
}

function togglePanelVisibility() {
    const panel = document.querySelector('.form-container');
    panel.classList.toggle('form-active');
}

function loadPanelControls() {
    const btnClosePanel = document.querySelector('#btnClosePanel');
    const btnExpandPanel = document.querySelector('#btnPlus');
    const btnRelasePanel = document.querySelector('#btnMinus');

    btnClosePanel.addEventListener('click', togglePanelVisibility);
    btnExpandPanel.addEventListener('click', () => modifyPanelWidth(200));
    btnRelasePanel.addEventListener('click', () => modifyPanelWidth(-200));
}

function modifyPanelWidth(value) {
    const rootElement = document.documentElement;
    let panelWidth = getComputedStyle(rootElement).getPropertyValue('--panel-width').trim();
    let pixelValue = parseFloat(panelWidth);
    let newWidth = pixelValue + value;

    if (newWidth < 500) {
        newWidth = 500;
    } else if (newWidth > 800) {
        newWidth = 800;
    }

    rootElement.style.setProperty('--panel-width', `${newWidth}px`);
}

function modifyPanelTitles(title, subtitle) {
    const panelTitle = document.querySelector('#panelTitle').textContent = title;
    const panelSubTitle = document.querySelector('#panelSubtitle').textContent = subtitle;
}

async function setPanelContent(content, updateEmployeeSelected) {
    const panelContentContainer = document.querySelector('#panel-container');

    if (panelContentContainer) {
        cleanPanelContentContainer();

        const table = createTable(content[0].persona, 'Tabla de empleados', 'table-employees');
        const tableBody = table.querySelector('#table-employees');

        const entries = [
            'persona.nombre',
            'persona.apellidoPaterno',
            'persona.apellidoMaterno',
            'persona.fechaNacimiento',
            'persona.edad',
            'persona.rfc',
            'persona.curp',
            'persona.nss'
        ];

        createTableContent(content, tableBody, updateEmployeeSelected, entries);

        panelContentContainer.appendChild(table);
    } else {
        msg.errorMessage("Error al cargar el panel", "No se pudo cargar el contenido en el panel", "Repita la acción nuevamente");
    }
}

function cleanPanelContentContainer() {
    const panelContentContainer = document.querySelector('#panel-container');
    panelContentContainer.innerHTML = '';
}

function createTable(content, caption, id) {
    let table;
    let headers = getObjetProperties(content);
    let [, ...restHeaders] = headers;

    table = cmp.createTable({
        Caption: caption,
        Headers: restHeaders,
        Id: id
    });

    return table;
}

function createTableContent(content, container, updateEmployeeSelected, properties = []) {
    content.forEach(item => {
        let row = document.createElement('tr');

        properties.forEach(property => {
            let cell = document.createElement('td');
            let value = property.split('.').reduce((obj, key) => obj && obj[key] !== undefined ? obj[key] : '', item);
            cell.textContent = value;
            row.appendChild(cell);
        });

        row.addEventListener('click', () => {
            if (updateEmployeeSelected != null) {
                updateEmployeeSelected(item);
                if (item.persona) {
                    updateAlertStatus(`${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno} (Creando nueva incidencia)`);
                }
            }
        });

        container.appendChild(row);
    });
}

function getObjetProperties(object) {
    return reformatParameters(Object.keys(object));
}

function reformatParameters(parameters) {
    return parameters.map(parameter => {
        let words = parameter.split(/(?=[A-Z])/);
        let upperCaseWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
        return upperCaseWords.join(' ');
    });
}

function updateAlertStatus(data) {
    const alert = document.querySelector('#selectionAlert');

    if (data == null) {
        alert.classList.add('alert-warning');
        alert.classList.remove('alert-success');
        alert.textContent = 'Ningún empleado seleccionado.';
    } else {
        alert.textContent = `Empleado seleccionado: ${data}`;
        alert.classList.remove('alert-warning');
        alert.classList.add('alert-success');
    }
}

async function saveIncidencia(employeeSelected) {
    if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado.");
        return;
    }
    
        const URL = URL_BASE + '/incidencia/insertIncidencia';
    const data = await hlp.getInputValues(dataInputs());
    
    try {
        let incidencia = createIncidenciaJson(data, employeeSelected);
        let resultado = await APIhlp.saveObjectApiData(URL, "incidencia", incidencia);
        
        if (resultado) {
            msg.successMessage("Incidencia Registrada", "La incidencia se registró con éxito.");
            let incidencias = await getAllIncidencia(employeeSelected.idEmpleado);
            showIncidenciaSelected(employeeSelected.idEmpleado, [employeeSelected]);
        } else {
            msg.errorMessage("Error", "Hubo un error al registrar la incidencia", "Por favor, vuelva a intentarlo.");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
    }
}

async function updateIncidencia(employeeSelected){
      if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado.");
        return;
    }
    
    const URL = URL_BASE + '/incidencia/modificarIncidencia';
    const data = await hlp.getInputValues(dataInputs());
    
    try {
        let incidencia = createIncidenciaJson(data, employeeSelected);
        let resultado = await APIhlp.saveObjectApiData(URL, "incidencia", incidencia);
        
        if (resultado) {
            msg.successMessage("Incidencia Registrada", "La incidencia se modificó con éxito.");
            let incidencias = await getAllIncidencia(employeeSelected.idEmpleado);
            showIncidenciaSelected(employeeSelected.idEmpleado, [employeeSelected]);
        } else {
            msg.errorMessage("Error", "Hubo un error al modificar la incidencia", "Por favor, vuelva a intentarlo.");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
    }
}


function createIncidenciaJson(inputsValues, employeeSelected) {
    return {
        empleado: {
            "idEmpleado": employeeSelected.idEmpleado
        },
        "gravedadIncidencia": inputsValues.severity,
        "motivoIncidencia": inputsValues.reason,
        "sancionIncidencia": inputsValues.sanction,
        "inicioCatigo": inputsValues.weekStart,
        "finCastigo": inputsValues.weekEnd
    };
}

async function getAllIncidencia(employeeSelected) {
    const URL = URL_BASE + '/incidencia/getAll?idEmpleado=' + employeeSelected;
    const incidencias = await APIhlp.getAllData(URL);
    return incidencias;
}

async function getAllEmployees() {
    const URL = URL_BASE + '/empleado/getAll';
    const employees = await APIhlp.getAllData(URL);
    return employees;
}

async function getAllData() {
    const data = [];
    const employees = await getAllEmployees();
    data.push(employees);
    return data;
}

function dataInputs() {
    const inputs = [
        { selector: '#txtWeekStart', key: 'weekStart', name: "Inicio de Semana", required: true },
        { selector: '#txtWeekEnd', key: 'weekEnd', name: "Fin de Semana", required: true},
        { selector: '#txtSeverity', key: 'severity', name: "Gravedad de la incidencia", required: true },
        { selector: '#txtReason', key: 'reason', name: "Motivo de la incidencia", required: true },
        { selector: '#txtSanction', key: 'sanction', name: "Sanción", required: true }
    ];

    return inputs;
}

async function showIncidenciaSelected(employeeSelected, employees) {
    const tableBody = document.querySelector('#table-row');

    if (employeeSelected != null) {
        let employeeInfo = employees.filter(empleado => empleado.idEmpleado === employeeSelected);

        if (employeeInfo.length > 0) {
            try {
                let incidencias = await getAllIncidencia(employeeSelected);
                if (incidencias.length > 0) {
                    // Limpia la tabla antes de añadir nuevas filas
                    cleanTableRows(tableBody);

                    // Añadir incidencias a la tabla
                    incidencias.forEach(incidencia => {
                        let row = document.createElement('tr');

                        row.innerHTML = `
                            <td>${incidencia.id_incidencia}</td>
                            <td>${incidencia.persona.nombre}</td>
                            <td>${incidencia.gravedadIncidencia}</td>
                            <td>${incidencia.motivoIncidencia}</td>
                            <td>${incidencia.sancionIncidencia}</td>
                            <td>${incidencia.fechaIncidencia}</td>
                            <td>${incidencia.inicioCatigo}</td>
                            <td>${incidencia.finCastigo}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    let row = document.createElement('tr');
                    row.innerHTML = '<td colspan="10">No hay incidencias para el empleado seleccionado.</td>';
                    tableBody.appendChild(row);
                }
            } catch (error) {
                console.error('Error al obtener las incidencias:', error);
                msg.errorMessage("Error al obtener incidencias", "Hubo un problema al obtener las incidencias del empleado.", "Intenta nuevamente más tarde.");
            }
        } else {
            msg.errorMessage("Empleado no encontrado", "El empleado seleccionado no está en la lista.", "Por favor, selecciona otro empleado.");
        }
    } else {
        msg.errorMessage("Ningún empleado seleccionado", "Por favor, selecciona un empleado.", "Presiona el botón 'Seleccionar Empleado'.");
    }
}

function cleanTableRows(tableBody) {
    tableBody.innerHTML = '';
}


// funcion para contar caracteres

function validarLongitudInput(valorInput, longitudMaxima) {
    return valorInput.length <= longitudMaxima;
}

function validarDataInputs() {
    const inputs = dataInputs();
    let esValido = true;

    inputs.forEach(input => {
        const valorInput = document.querySelector(input.selector).value;

        // Validar solo los campos que no son fechas
        if (input.selector !== '#txtWeekStart' && input.selector !== '#txtWeekEnd') {
            if (!validarLongitudInput(valorInput, 255)) {
                esValido = false;
                         msg.errorMessage("Error", "Por favor, vuelva a intentarlo.", "Debes colocar menos de 255 caracteres");
            }
        }
    });

    return esValido;
}
