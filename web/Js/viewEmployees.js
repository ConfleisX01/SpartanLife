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
    },
    {
      "Nombre": "Ana Maria",
      "Apellidos": "Lopez Gomez",
      "Nacimiento": "15/06/1995",
      "Edad": "29",
      "Puesto": "Analista",
      "RFC": "LOGA950615HDFJMA02",
      "CURP": "LOGA950615HDFJMA04",
      "NSS": "23456789012",
      "Antiguedad": "1 año",
      "Sucursal": "Alfa"
    },
    {
      "Nombre": "Carlos Alberto",
      "Apellidos": "Martinez Ruiz",
      "Nacimiento": "10/12/1987",
      "Edad": "36",
      "Puesto": "Gerente",
      "RFC": "MARU871210HDFCLR03",
      "CURP": "MARU871210HDFCLR09",
      "NSS": "34567890123",
      "Antiguedad": "5 años",
      "Sucursal": "Beta"
    },
    {
      "Nombre": "Luis Fernando",
      "Apellidos": "Hernandez Torres",
      "Nacimiento": "22/07/1992",
      "Edad": "31",
      "Puesto": "Contador",
      "RFC": "HETL920722HDFRRS04",
      "CURP": "HETL920722HDFRRS01",
      "NSS": "45678901234",
      "Antiguedad": "3 años",
      "Sucursal": "Gamma"
    },
    {
      "Nombre": "Maria Fernanda",
      "Apellidos": "Sanchez Dominguez",
      "Nacimiento": "03/04/2000",
      "Edad": "24",
      "Puesto": "Recursos Humanos",
      "RFC": "SADM000403HDFNMA05",
      "CURP": "SADM000403HDFNMA07",
      "NSS": "56789012345",
      "Antiguedad": "6 meses",
      "Sucursal": "Delta"
    },
    {
      "Nombre": "Jorge Luis",
      "Apellidos": "Garcia Martinez",
      "Nacimiento": "18/09/1984",
      "Edad": "39",
      "Puesto": "Ingeniero",
      "RFC": "GAMJ840918HDFRML02",
      "CURP": "GAMJ840918HDFRML03",
      "NSS": "67890123456",
      "Antiguedad": "10 años",
      "Sucursal": "Alfa"
    },
    {
      "Nombre": "Paula Andrea",
      "Apellidos": "Rodriguez Salazar",
      "Nacimiento": "12/05/1998",
      "Edad": "26",
      "Puesto": "Diseñadora",
      "RFC": "ROSP980512MDFDLN06",
      "CURP": "ROSP980512MDFDLN08",
      "NSS": "78901234567",
      "Antiguedad": "2 años",
      "Sucursal": "Beta"
    },
    {
      "Nombre": "Ricardo Antonio",
      "Apellidos": "Gonzalez Perez",
      "Nacimiento": "23/11/1976",
      "Edad": "47",
      "Puesto": "Administrador",
      "RFC": "GOPR761123HDFNLN04",
      "CURP": "GOPR761123HDFNLN01",
      "NSS": "89012345678",
      "Antiguedad": "8 años",
      "Sucursal": "Gamma"
    },
    {
      "Nombre": "Sofia Isabel",
      "Apellidos": "Ramirez Flores",
      "Nacimiento": "05/01/1989",
      "Edad": "35",
      "Puesto": "Marketing",
      "RFC": "RAFJ890105MDFLSR05",
      "CURP": "RAFJ890105MDFLSR07",
      "NSS": "90123456789",
      "Antiguedad": "7 años",
      "Sucursal": "Delta"
    },
    {
      "Nombre": "Miguel Angel",
      "Apellidos": "Ortega Gutierrez",
      "Nacimiento": "30/03/1994",
      "Edad": "30",
      "Puesto": "Consultor",
      "RFC": "OGUM940330HDFNGL03",
      "CURP": "OGUM940330HDFNGL06",
      "NSS": "01234567890",
      "Antiguedad": "4 años",
      "Sucursal": "Alfa"
    },
    {
      "Nombre": "Laura Patricia",
      "Apellidos": "Vargas Herrera",
      "Nacimiento": "17/02/1991",
      "Edad": "33",
      "Puesto": "Abogada",
      "RFC": "VAHL910217MDFRLR02",
      "CURP": "VAHL910217MDFRLR05",
      "NSS": "12345678902",
      "Antiguedad": "5 años",
      "Sucursal": "Beta"
    },
    {
      "Nombre": "David Alejandro",
      "Apellidos": "Mendoza Ortiz",
      "Nacimiento": "11/11/1980",
      "Edad": "43",
      "Puesto": "Director",
      "RFC": "MEOD801111HDFNRD01",
      "CURP": "MEOD801111HDFNRD02",
      "NSS": "23456789013",
      "Antiguedad": "15 años",
      "Sucursal": "Gamma"
    },
    {
      "Nombre": "Valeria Guadalupe",
      "Apellidos": "Morales Chavez",
      "Nacimiento": "27/07/1993",
      "Edad": "30",
      "Puesto": "Asistente",
      "RFC": "MOCH930727MDFRVS05",
      "CURP": "MOCH930727MDFRVS08",
      "NSS": "34567890124",
      "Antiguedad": "2 años",
      "Sucursal": "Delta"
    },
    {
      "Nombre": "Jose Manuel",
      "Apellidos": "Torres Vazquez",
      "Nacimiento": "14/12/1985",
      "Edad": "38",
      "Puesto": "Coordinador",
      "RFC": "TOVJ851214HDFNRS04",
      "CURP": "TOVJ851214HDFNRS07",
      "NSS": "45678901235",
      "Antiguedad": "9 años",
      "Sucursal": "Alfa"
    },
    {
      "Nombre": "Karla Itzel",
      "Apellidos": "Reyes Luna",
      "Nacimiento": "09/08/1996",
      "Edad": "27",
      "Puesto": "Arquitecta",
      "RFC": "RELI960809MDFNRR08",
      "CURP": "RELI960809MDFNRR03",
      "NSS": "56789012346",
      "Antiguedad": "1 año",
      "Sucursal": "Beta"
    },
    {
      "Nombre": "Fernando Javier",
      "Apellidos": "Diaz Nunez",
      "Nacimiento": "06/02/1982",
      "Edad": "42",
      "Puesto": "Consultor",
      "RFC": "DINF820206HDFNRV07",
      "CURP": "DINF820206HDFNRV06",
      "NSS": "67890123457",
      "Antiguedad": "11 años",
      "Sucursal": "Gamma"
    },
    {
      "Nombre": "Gabriela Elena",
      "Apellidos": "Vazquez Molina",
      "Nacimiento": "19/10/1990",
      "Edad": "33",
      "Puesto": "Psicóloga",
      "RFC": "VAMG901019MDFNZS05",
      "CURP": "VAMG901019MDFNZS02",
      "NSS": "78901234568",
      "Antiguedad": "4 años",
      "Sucursal": "Delta"
    },
    {
      "Nombre": "Hector Mauricio",
      "Apellidos": "Lara Pineda",
      "Nacimiento": "22/03/1983",
      "Edad": "41",
      "Puesto": "Investigador",
      "RFC": "LAPH830322HDFNMR03",
      "CURP": "LAPH830322HDFNMR09",
      "NSS": "89012345679",
      "Antiguedad": "6 años",
      "Sucursal": "Alfa"
    },
    {
      "Nombre": "Monica Alejandra",
      "Apellidos": "Mejia Salinas",
      "Nacimiento": "31/07/1988",
      "Edad": "35",
      "Puesto": "Redactora",
      "RFC": "MESM880731MDFNLL02",
      "CURP": "MESM880731MDFNLL04",
      "NSS": "90123456780",
      "Antiguedad": "2 años",
      "Sucursal": "Beta"
    },
    {
      "Nombre": "Enrique Tomas",
      "Apellidos": "Fernandez Ochoa",
      "Nacimiento": "29/06/1978",
      "Edad": "46",
      "Puesto": "Administrador",
      "RFC": "FEOE780629HDFNHR08",
      "CURP": "FEOE780629HDFNHR03",
      "NSS": "01234567891",
      "Antiguedad": "12 años",
      "Sucursal": "Gamma"
    },
    {
      "Nombre": "Patricia Guadalupe",
      "Apellidos": "Cruz Mendoza",
      "Nacimiento": "13/04/1997",
      "Edad": "27",
      "Puesto": "Recepcionista",
      "RFC": "CRMP970413MDFNNN01",
      "CURP": "CRMP970413MDFNNN04",
      "NSS": "12345678903",
      "Antiguedad": "3 años",
      "Sucursal": "Delta"
    }
  ]
  
  
  
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
    element.classList.toggle('');
  }
  
  loadTable()