// ? Funcion para cargar el modulo entero desde el menu
export function loadModule(container, content) {
    let body = document.querySelector(container)

    body.innerHTML = content

    loadControls()
}

// ? Funcion para cargar los controles principales del modulo
function loadControls() {
    const buttonNewEmployee = document.querySelector('#btnAddNew')
    const form = document.querySelector('.form-container')

    buttonNewEmployee.addEventListener('click', () => {
        if (!form.classList.contains('form-active') && !form.classList.contains('form-edit')) {
            loadEmptyForm()
        } else {
            Swal.fire({
                title: "Acción no permitida",
                text: "Actualmente tienes un formulario abierto. Por favor, ciérralo antes de abrir otro.",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Cerrar formulario"
            }).then((result) => {
                if (result.isConfirmed) {
                    closeForm()
                }
            });
            
            fixDashboard()
        }
    })

    loadTable()
}

// ? Funcion para cargar la tabla de empleados con la informacion de los empleados
function loadTable() {
    const tableBody = document.querySelector('#table-body')
    const form = document.querySelector('.form-container')

    employees.forEach((employee, index) => {
        let employeeItem = document.createElement('tr')
        let photo = document.createElement('th')
        let name = document.createElement('th')
        let born = document.createElement('th')
        let age = document.createElement('th')
        let job = document.createElement('th')
        let rfc = document.createElement('th')
        let curp = document.createElement('th')
        let nss = document.createElement('th')
        let old = document.createElement('th')
        let position = document.createElement('th')

        photo.textContent = employee.Foto
        name.textContent = employee.Nombre + " " + employee.Apellidos
        born.textContent = employee.Nacimiento
        age.textContent = employee.Edad
        job.textContent = employee.Puesto
        rfc.textContent = employee.RFC
        curp.textContent = employee.CURP
        nss.textContent = employee.NSS
        old.textContent = employee.Antiguedad
        position.textContent = employee.Sucursal

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

        employeeItem.addEventListener('click', () => {
            if (!form.classList.contains('form-active') || !form.classList.contains('form-empty')) {
                loadEmployeeData(index)
            } else {
                Swal.fire({
                    title: "Acción no permitida",
                    text: "Actualmente tienes un formulario abierto. Por favor, ciérralo antes de abrir otro.",
                    icon: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Cerrar formulario"
                }).then((result) => {
                    if (result.isConfirmed) {
                        closeForm()
                    }
                });

                fixDashboard()
            }
        })

        tableBody.appendChild(employeeItem)
    })
}

// ? Funcion para cargar el empleado al formulario
function loadEmployeeData(index) {
    const employee = employees[index]

    loadDataOnForm(employee)
}

// ? Funcion para cargar el formulario con los datos del empleado seleccionado
function loadDataOnForm(employee) {
    let inputs = document.querySelectorAll('.form-container-inputs input')
    let form = document.querySelector('.form-container')
    let buttonsContainer = document.querySelector('.buttons-container')
    let buttonSave = document.createElement('button')
    const formDangerZone = document.querySelector('.form-danger-zone')

    buttonSave.classList.add('btn-base')
    buttonSave.classList.add('button_update')
    buttonSave.id = 'btnUpdate'
    buttonSave.innerHTML = "Guardar Cambios"

    // * Condicionamos a que solamente se agregue el boton si se abrio por primera vez el formulario
    if (!form.classList.contains('form-active')) {
        buttonsContainer.appendChild(buttonSave)
    }

    if (formDangerZone.classList.contains('d-none')) {
        formDangerZone.classList.remove('d-none')
    }

    // * Cargamos los datos del empleado en el formulario para modificarlos
    inputs[0].value = employee.Nombre
    inputs[1].value = employee.Apellidos
    inputs[2].value = setFormatedDate(employee.Nacimiento)
    inputs[3].value = employee.Edad
    inputs[4].value = employee.Puesto
    inputs[5].value = employee.RFC
    inputs[6].value = employee.CURP
    inputs[7].value = employee.NSS
    inputs[8].value = employee.Antiguedad
    inputs[9].value = employee.Sucursal

    form.classList.add('form-active')
    form.classList.add('form-edit')

    loadControlsForm()
}

// ? Funcion para mostrar un formulario vacio para agregar un empleado nuevo
function loadEmptyForm() {
    const form = document.querySelector('.form-container')
    const formDangerZone = document.querySelector('.form-danger-zone')

    cleanForm()

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

// ? Funcion para formatear una fecha DD/MM/YYYY al formato de los inptus tipo DATE
function setFormatedDate(dateString) {
    const parts = dateString.split('/')
    const day = parts[0]
    const month = parts[1]
    const year = parts[2]

    const formatedDate = `${year}-${month}-${day}`

    return formatedDate
}

// ? Funcion para cargar los controles del formulario de edicion
function loadControlsForm() {
    const form = document.querySelector('.form-container')
    const btnBack = document.querySelector('#btnBack')
    const btnSave = document.querySelector('#btnSave')
    const btnUpdate = document.querySelector('#btnUpdate')
    const btnDelete = document.querySelector('#btnDelete')

    btnBack.removeEventListener('click', closeForm)
    btnBack.addEventListener('click', closeForm)

    if (btnUpdate != null) {
        btnUpdate.removeEventListener('click', updateEmployee)
        btnUpdate.addEventListener('click', updateEmployee)
    }

    if (btnSave != null) {
        btnSave.removeEventListener('click', saveEmployee)
        btnSave.addEventListener('click', saveEmployee)
    }

    btnDelete.removeEventListener('click', deleteEmployee)
    btnDelete.addEventListener('click', deleteEmployee)
}

// ? Funcion para limpiar el formulario en caso de ser necesario
function cleanForm() {
    let inputs = document.querySelectorAll('.form-container-inputs input')

    inputs.forEach(input => {
        input.value = ''
    })
}

function fixDashboard() {
    const container = document.querySelector('body')
    container.classList.remove('swal2-height-auto')
}

function closeForm() {
    const form = document.querySelector('.form-container')
    const buttonsContainer = document.querySelector('.buttons-container')

    buttonsContainer.innerHTML = ''

    form.classList.remove('form-active')
    form.classList.remove('form-edit')
    form.classList.remove('form-empty')
}

function updateEmployee() {
    alert("Actualizando los datos...")
}

function deleteEmployee() {
    alert("Borrando empleado...")
}

function saveEmployee() {
    alert("Guardando empleado nuevo...")
}

// ? Datos falsos
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
];