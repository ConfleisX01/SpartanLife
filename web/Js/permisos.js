import * as msg from './messages.js';
import * as hlp from './helpers.js';
import * as APIhlp from './APIHelpers.js';
import { URL_BASE } from './config.js';
import * as cmp from './components.js';

let html;

export function loadPermisosModule(content) {
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
        // Llama a showPermisoSelected después de seleccionar un empleado
        showPermisoSelected(employeeSelected.idEmpleado, employees);
    }

    loadPanelControls();
    updateAlertStatus();

    const buttonSelectEmployee = document.querySelector('#btnSelectEmployee');
    buttonSelectEmployee.addEventListener('click', () => selectEmployee(employees, updateEmployeeSelected));

    const buttonSave = document.querySelector('#btnSave');
    buttonSave.addEventListener('click', () => savePermiso(employeeSelected));
    
        const buttonUpdate = document.querySelector('#btnUpdate');
    buttonUpdate.addEventListener('click', () => updatePermiso(employeeSelected));
}

function selectEmployee(content, updateEmployeeSelected) {
    setPanelContent(content, updateEmployeeSelected);
    modifyPanelTitles('Selección de Empleados', 'Selecciona un empleado para registrar un Permiso');
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
                    updateAlertStatus(`${item.persona.nombre} ${item.persona.apellidoPaterno} ${item.persona.apellidoMaterno} (Creando nuevo permiso)`);
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

async function savePermiso(employeeSelected) {
     // Validar la longitud de los inputs antes de continuar
    if (!validarDataInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
    if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado.");
        return;
    }
    
    const URL = URL_BASE + '/permiso/insertPermiso';
    const data = await hlp.getInputValues(dataInputs());
    
    try {
        let permiso = createPermisoJson(data, employeeSelected);
        let resultado = await APIhlp.saveObjectApiData(URL, "permiso", permiso);
        console.log(permiso)
        
        if (resultado) {
            msg.successMessage("Permiso Registrado", "El permiso se registró con éxito.");
            let permisos = await getAllPermiso(employeeSelected.idEmpleado);
            showPermisoSelected(employeeSelected.idEmpleado, [employeeSelected]);
        } else {
            msg.errorMessage("Error", "Hubo un error al registrar el permiso", "Por favor, vuelva a intentarlo.");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
    }
}

async function updatePermiso(employeeSelected){
      // Validar la longitud de los inputs antes de continuar
    if (!validarDataInputs()) {
        return // Si la validación falla, se detiene la ejecución de la función
    }
      if (!employeeSelected) {
        msg.errorMessage("Error", "No se ha seleccionado un empleado", "Por favor, seleccione un empleado.");
        return;
    }
    
    const URL = URL_BASE + '/permiso/modificarPermiso';
    const data = await hlp.getInputValues(dataInputs());
    
    try {
        let permiso = createPermisoJson(data, employeeSelected);
        let resultado = await APIhlp.saveObjectApiData(URL, "permiso", permiso);
        
        if (resultado) {
            msg.successMessage("Permiso Registrado", "El Permiso se modificó con éxito.");
            let permisos = await getAllPermiso(employeeSelected.idEmpleado);
            showPermisoSelected(employeeSelected.idEmpleado, [employeeSelected]);
        } else {
            msg.errorMessage("Error", "Hubo un error al modificar el Permiso", "Por favor, vuelva a intentarlo.");
        }
    } catch (error) {
        console.error('Error en la solicitud:', error);
        msg.errorMessage("Error", "Error al procesar la solicitud", "Por favor, vuelva a intentarlo más tarde.");
    }
}


function createPermisoJson(inputsValues, employeeSelected) {
    return {
        empleado: {
            "idEmpleado": employeeSelected.idEmpleado
        },
        "motivoPermiso": inputsValues.motivo,
        "explicacionPermiso": inputsValues.explicacion,
        "fechaInicio": inputsValues.weekStart,
        "fechaFin": inputsValues.weekEnd
    };
}

async function getAllPermiso(employeeSelected) {
    const URL = URL_BASE + '/permiso/getAll?idEmpleado=' + employeeSelected;
    const permisos = await APIhlp.getAllData(URL);
    return permisos;
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
        { selector: '#txtWeekStart', key: 'weekStart', name: "Inicio del Permiso" },
        { selector: '#txtWeekEnd', key: 'weekEnd', name: "Fin del Permiso" },
        { selector: '#txtMotivo', key: 'motivo', name: "Motivo Permiso" },
        { selector: '#txtExplicacion', key: 'explicacion', name: "Explicacion del permiso" },
    ];

    return inputs;
}

async function showPermisoSelected(employeeSelected, employees) {
    const tableBody = document.querySelector('#table-row');

    if (employeeSelected != null) {
        let employeeInfo = employees.filter(empleado => empleado.idEmpleado === employeeSelected);

        if (employeeInfo.length > 0) {
            try {
                let permisos = await getAllPermiso(employeeSelected);
                if (permisos.length > 0) {
                    // Limpia la tabla antes de añadir nuevas filas
                    cleanTableRows(tableBody);

                    // Añadir permisos a la tabla
                    permisos.forEach(permiso => {
                        let row = document.createElement('tr');

                        row.innerHTML = `
                            <td>${permiso.id_permiso}</td>
                            <td>${permiso.persona.nombre}</td>
                            <td>${permiso.motivoPermiso}</td>
                            <td>${permiso.explicacionPermiso}</td>
                            <td>${permiso.fechaPermiso}</td>
                            <td>${permiso.fechaInicio}</td>
                            <td>${permiso.fechaFin}</td>
                        `;
                        tableBody.appendChild(row);
                    });
                } else {
                    let row = document.createElement('tr');
                    row.innerHTML = '<td colspan="10">No hay permisos para el empleado seleccionado.</td>';
                    tableBody.appendChild(row);
                }
            } catch (error) {
                console.error('Error al obtener los permisos:', error);
                msg.errorMessage("Error al obtener permisos", "Hubo un problema al obtener los permisos del empleado.", "Intenta nuevamente más tarde.");
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


// contar caracteres
function validarLongitudInput(valorInput, longitudMaxima) {
    return valorInput.length <= longitudMaxima;
}

function validarDataInputs() {
    const inputs = dataInputs();
    let esValido = true;

    inputs.forEach(input => {
        const valorInput = document.querySelector(input.selector).value;

        // Validar según el campo específico
        switch (input.key) {
            case 'motivo':
                if (!validarLongitudInput(valorInput, 255)) {
                    esValido = false;
                    msg.errorMessage("Error", "Por favor, vuelva a intentarlo.", `El campo '${input.name}' debe contener menos de 255 caracteres.`);
                }
                break;
            case 'explicacion':
                if (!validarLongitudInput(valorInput, 500)) {
                    esValido = false;
                    msg.errorMessage("Error", "Por favor, vuelva a intentarlo.", `El campo '${input.name}' debe contener menos de 500 caracteres.`);
                }
                break;
            default:
                // Otros campos pueden tener validaciones específicas si es necesario
                break;
        }
    });

    return esValido;
}
