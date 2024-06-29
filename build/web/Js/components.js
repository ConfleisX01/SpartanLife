// ? Esta funcion crea una tabla pasando como parametro un objeto con el numero de parametros que se mostraran
export function createTable(data) {
    let table = document.createElement('table')
    let tableBody = document.createElement('tbody')
    let header = document.createElement('thead')

    // ? Agregamos las clases a la tabla
    table.classList.add('table')
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
        });

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