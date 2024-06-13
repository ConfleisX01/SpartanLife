export function loadUserViewTable(content) {
    const container = document.querySelector('#module-container')

    container.innerHTML = ''
    container.innerHTML = content

    loadTable()
}

function loadTable() {
    const table = document.getElementById('table-employe-container');

    employees.forEach(employee => {
        let item = loadItem(employee);
        let template = document.createElement('template');
        template.innerHTML = item.trim();
        table.appendChild(template.content.firstChild);
    });

    addClickEventToHiddenInfo();
}

function loadItem(employee) {
    let item = `<div class="table-item">
                <div class="row">
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <img class="employe-table-image" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg" alt="">
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <p class="employe-param-title" id="txtNameView">${employee.Nombre}</p>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <p class="employe-param-title" id="txtJobView">${employee.Puesto}</p>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <p class="employe-param-title" id="txtRFCView">${employee.RFC}</p>
                  </div>
                  <div class="col-md-12 employe-info-hidden row py-3 p-0 m-0 d-none">
                    <div class="col-md-3 text-center">
                      <img class="employe-table-info-image" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg">
                      <p class="fs-2 m-0" id="txtNameHidden">${employee.Nombre}</p>
                      <p class="fs-5 m-0 fw-light" id="txtLastNameHidden">${employee.Apellidos}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtBornHidden">Fecha de Nacimiento: ${employee.Nacimiento}</p>
                      <p class="employe-param-title fw-light" id="txtAgeHidden">Edad: ${employee.Edad}</p>
                      <p class="employe-param-title fw-light" id="txtJobHidden">Puesto: ${employee.Puesto}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtRFCHidden">RFC: ${employee.RFC}</p>
                      <p class="employe-param-title fw-light" id="txtCURPHidden">CURP: ${employee.CURP}</p>
                      <p class="employe-param-title fw-light" id="txtNSSHidden">NSS: ${employee.NSS}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtAntiquityHidden">Antiguedad: ${employee.Antiguedad}</p>
                      <p class="employe-param-title fw-light" id="txtBranchHidden">Sucursal: ${employee.Sucursal}</p>
                    </div>
                  </div>
                </div>
              </div>`;
    return item;
}

function addClickEventToHiddenInfo() {
    let tableItems = document.querySelectorAll('.table-item');

    tableItems.forEach(item => {
        item.addEventListener('click', () => {
            let hiddenInfo = item.querySelector('.employe-info-hidden');
            if (hiddenInfo) {
                toggleHiddenClass(hiddenInfo);
            }
        });
    });
}

function toggleHiddenClass(element) {
    element.classList.toggle('d-none');
}

// Datos falsos
const employees = [
    {
        "Nombre": "Juan Pablo",
        "Apellidos": "Perez Fernandez",
        "Nacimiento": "22/02/2004",
        "Edad": "20",
        "Puesto": "Desarrollador",
        "RFC": "PERJ800101HNLAJR01",
        "CURP": "PERJ800101HNLAJR08",
        "NSS": "12345678901",
        "Antiguedad": "2 meses",
        "Sucursal": "Delta"
    }
]