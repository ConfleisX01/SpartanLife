import * as msg from './messages.js'
import * as APIhlp from './APIHelpers.js'

export function loadUserViewTable(content) {
    const container = document.querySelector('#module-container')

    container.innerHTML = ''
    container.innerHTML = content

    loadTable()
}

async function loadTable() {
    const table = document.getElementById('table-employe-container');

    const employees = await APIhlp.getAllData("http://localhost:8080/SpartanLife/api/empleado/getAll")

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
                    <p class="employe-param-title" id="txtNameView">${employee.persona.nombre}</p>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <p class="employe-param-title" id="txtJobView">${employee.puesto.nombrePuesto}</p>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <p class="employe-param-title" id="txtRFCView">${employee.persona.rfc}</p>
                  </div>
                  <div class="col-md-12 employe-info-hidden row py-3 p-0 m-0 d-none">
                    <div class="col-md-3 text-center">
                      <img class="employe-table-info-image" src="https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg">
                      <p class="fs-2 m-0" id="txtNameHidden">${employee.persona.nombre}</p>
                      <p class="fs-5 m-0 fw-light" id="txtLastNameHidden">${employee.persona.apellidoPaterno + " "+ employee.persona.apellidoMaterno}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtBornHidden">Fecha de Nacimiento: ${employee.persona.fechaNacimiento}</p>
                      <p class="employe-param-title fw-light" id="txtAgeHidden">Edad: ${employee.persona.edad}</p>
                      <p class="employe-param-title fw-light" id="txtJobHidden">Puesto: ${employee.puesto.nombrePuesto}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtRFCHidden">RFC: ${employee.persona.rfc}</p>
                      <p class="employe-param-title fw-light" id="txtCURPHidden">CURP: ${employee.persona.curp}</p>
                      <p class="employe-param-title fw-light" id="txtNSSHidden">NSS: ${employee.persona.nss}</p>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <p class="employe-param-title fw-light" id="txtAntiquityHidden">Antiguedad: ${employee.antiguedad}</p>
                      <p class="employe-param-title fw-light" id="txtBranchHidden">Sucursal: ${employee.sucursal.nombreSucursal}</p>
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