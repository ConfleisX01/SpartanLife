// ? Esta funcion crea una tabla pasando como parametro un objeto con el numero de parametros que se mostraran
export function createTable(data) {
    let table = document.createElement('table')
    let tableBody = document.createElement('tbody')
    let header = document.createElement('thead')

    // ? Agregamos las clases a la tabla
    table.classList.add('table')
    table.classList.add('table-sm')
    table.classList.add('table-hover')
    table.classList.add('caption-top')

    // ? Agregamos un caption en caso de que se requiera
    if (data.Caption) {
        let caption = document.createElement('caption')
        caption.textContent = data.Caption
        table.appendChild(caption)
    }

    // ? Creamos los headers o titulos de la tabla
    if (data.Headers) {
        let headersData = data.Headers
        let headersContainer = document.createElement('tr')

        headersData.forEach(header => {
            let content = document.createElement('th')

            content.scope = 'col'
            content.textContent = header

            headersContainer.appendChild(content)
        })

        header.appendChild(headersContainer)
    }

    // ? Creamos el id del cuerpo de la tabla
    if (data.Id) {
        tableBody.id = data.Id

    } else {
        tableBody.id = 'table-content'
    }

    table.appendChild(header)
    table.appendChild(tableBody)

    return table
}

// ? Esta funcion carga el panel en el html de cualquier modulo como un componente
/*
    data = {
        Title: "Titulo del panel",
        Subtitle: "Subtitulo del panel",
        Type: "Tipo de panel (Form || Table)"
    }
*/
function createPanel(data, behaviour) {
    // Crear elementos principales del panel
    let panelContainer = document.createElement('div')
    panelContainer.classList.add('form-container', 'd-flex', 'flex-column')

    let panelHeader = document.createElement('div')
    panelHeader.classList.add('container-fluid', 'd-flex', 'justify-content-between', 'p-2', 'separator')

    let titleContainer = document.createElement('div')
    titleContainer.classList.add('container-fluid', 'py-3', 'separator')

    let panelBody = document.createElement('div')
    panelBody.classList.add('container-fluid', 'py-3', 'flex-grow-1', 'overflow-auto')

    // Crear botón para cerrar el panel
    let btnClosePanel = document.createElement('button')
    btnClosePanel.classList.add('btn-base', 'button_1')
    btnClosePanel.textContent = 'Cerrar'
    btnClosePanel.id = 'btnClosePanel'

    btnClosePanel.addEventListener('click', () => closePanel(panelContainer))

    // Crear título y subtítulo si están definidos en data
    if (data.Title) {
        let title = document.createElement('h5')
        title.textContent = data.Title;
        titleContainer.appendChild(title);
    }

    if (data.Subtitle) {
        let subTitle = document.createElement('p')
        subTitle.textContent = data.Subtitle;
        titleContainer.appendChild(subTitle);
    }

    // Determinar tipo de panel (Form o Table) y configurar panelBodyContainer
    let panelBodyContainer = document.createElement('div')
    panelBodyContainer.classList.add('container-fluid', 'p-0')

    if (data.Type === 'Table') {
        panelBodyContainer.classList.add('table-responsive')

    } else if (data.Type === 'Form') {
        panelBodyContainer.classList.add('container-fluid', 'row')
    }
    

    behaviour(panelBodyContainer)

    // Agregar botón de cerrar al header
    let headerCloseContainer = document.createElement('div')
    headerCloseContainer.appendChild(btnClosePanel);
    panelHeader.appendChild(headerCloseContainer);

    // Agregar elementos al panelContainer según su estructura
    panelContainer.appendChild(panelHeader);
    panelContainer.appendChild(titleContainer);
    panelBody.appendChild(panelBodyContainer);
    panelContainer.appendChild(panelBody);

    panelContainer.classList.add('form-active')

    return panelContainer;
}

function closePanel(panel) {
    panel.classList.remove('form-active')
}

export function getPanelData(data, behaviour) {
    let panel = createPanel(data, behaviour)

    return panel
}
