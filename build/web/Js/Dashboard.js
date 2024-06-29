import * as msg from './messages.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

export function loadUserViewTable(content) {
  const container = document.querySelector('#module-container')

  container.innerHTML = ''
  container.innerHTML = content

  loadTable()
}

async function loadTable() {
  const URL = URL_BASE + '/empleado/getAll'
  const table = document.getElementById('table-employe-container')

  const employees = await APIhlp.getAllData(URL)

  if (employees.Type) {
    msg.errorMessage("Error", "Se produjo un error al cargar los datos de la tabla.", "Por favor, verifique que el servidor esté funcionando correctamente.")
  } else {
    employees.forEach(employee => {
      let item = loadItem(employee)
      let template = document.createElement('template')
      template.innerHTML = item.trim()
      table.appendChild(template.content.firstChild)
    })
  }

  addClickEventToHiddenInfo()
}

function loadItem(employee) {
  let item = `<div class="table-item">
                <div class="row">
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <img class="employe-table-image" src="${employee.foto}" alt="">
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <h5 class="employe-param-title" id="txtNameView">${employee.persona.nombre}</h5>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <h5 class="employe-param-title" id="txtJobView">${employee.puesto.nombrePuesto}</h5>
                  </div>
                  <div class="col-6 col-md-3 d-flex align-items-center">
                    <h5 class="employe-param-title" id="txtRFCView">${employee.persona.rfc}</h5>
                  </div>
                  <div class="col-md-12 employe-info-hidden row py-3 p-0 m-0 d-none">
                    <div class="col-md-3 text-center">
                      <img class="employe-table-info-image" src="${employee.foto}">
                      <h4 class="fs-2 m-0" id="txtNameHidden">${employee.persona.nombre}</h4>
                      <h4 class="fs-5 m-0 fw-light" id="txtLastNameHidden">${employee.persona.apellidoPaterno + " " + employee.persona.apellidoMaterno}</h4>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <h4 class="employe-param-title fw-light" id="txtBornHidden">Fecha de Nacimiento: <p>${employee.persona.fechaNacimiento}</p></h4>
                      <h4 class="employe-param-title fw-light" id="txtAgeHidden">Edad: <p>${employee.persona.edad}</p></h4>
                      <h4 class="employe-param-title fw-light" id="txtJobHidden">Puesto: <p>${employee.puesto.nombrePuesto}</p></h4>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <h4 class="employe-param-title fw-light" id="txtRFCHidden">RFC: <p>${employee.persona.rfc}</p></h4>
                      <h4 class="employe-param-title fw-light" id="txtCURPHidden">CURP: <p>${employee.persona.curp}</p></h4>
                      <h4 class="employe-param-title fw-light" id="txtNSSHidden">NSS: <p>${employee.persona.nss}</p></h4>
                    </div>
                    <div class="col-md-3 text-center text-md-start">
                      <h4 class="employe-param-title fw-light" id="txtAntiquityHidden">Antiguedad: <p>${employee.antiguedad}</p></h4>
                      <h4 class="employe-param-title fw-light" id="txtBranchHidden">Sucursal: <p>${employee.sucursal.nombreSucursal}</p></h4>
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