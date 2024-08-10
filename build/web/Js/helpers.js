/// Funciones de ayuda

// Obtiene el HTML de un modulo, pasando como parametro la URL del archivo
export async function getModule(url) {
    try {
        const response = await fetch(url)

        const html = await response.text()

        return html
    } catch (error) {
        alert("Error al obtener el contenido, intentelo nuevamente")
        console.error('Error:', error)
        return null
    }
}

export function applyContent(content, id) {
    document.getElementById(id).innerHTML = ""
    document.getElementById(id).innerHTML = content
}

// Verificar que los inputs que se pasen por el parametro tengan algun valor
export function verifyInputs(inputs) {
    for (let input of inputs) {
        if (input.value.trim() === '') {
            return false
        }
    }
    return true
}

// Guarda directamente en el LocalStorage, pasando como parametro el nombre y el valor
export function saveToLocalStorage(key, value) {
    try {
        localStorage.setItem(key, value)
    } catch (error) {
        alert("Error al guardar el valor, intentelo nuevamente")
    }
}

// Retorna el valor buscado en el LocalStorage, pasando como parametro el nombre de identificacion
export function getFromLocalStorage(key) {
    try {
        const value = localStorage.getItem(key)
        return value ? value : null
    } catch (error) {
        alert("Error al cargar el valor, intentelo nuevamente")
    }
}

export function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export async function getInputValues(inputs) {
    let data = {}
    let info = { Type: 'INFORMATION_INCOMPLETE', MisingFields: [] }

    for (const input of inputs) {
        const element = document.querySelector(input.selector)

        if (element) {
            const value = await verifyInputValue(element, input.required)

            if (value) {
                data[input.key] = value
            } else if (input.required) {  // Solo agregar a los campos faltantes si es requerido
                info.MisingFields.push(input.name)
            }
        } else if (input.required) {  // Solo agregar a los campos faltantes si es requerido
            info.MisingFields.push(input.name)
        }
    }

    if (info.MisingFields.length > 0) {
        return info
    }

    return data
}

async function verifyInputValue(input, isRequired) {
    const MAX_FILE_SIZE = 5
    const FIRST_FILE = 0

    if (input.type === 'file') {
        if (input.files.length > 0 && getFileSize(input.files[FIRST_FILE]) <= MAX_FILE_SIZE && input.files[FIRST_FILE].type.match('image/*')) {
            return await fileToBase64(input.files[FIRST_FILE])
        } else if (input.files.length > 0 && getFileSize(input.files[FIRST_FILE]) <= MAX_FILE_SIZE && input.files[FIRST_FILE].type === 'application/pdf') {
            return await fileToBase64(input.files[FIRST_FILE])
        }
        else {
            return false
        }
    } else {
        if (input.value !== '') {
            return input.value
        } else if (!isRequired) {  // Si no es requerido, retornar valor vacío
            return input.value
        } else {
            return false
        }
    }
}

export function getFileSize(file) {
    let fileSizeInBytes = file.size
    let fileSizeInKB = (fileSizeInBytes / 1024).toFixed(2)
    let fileSizeInMB = (fileSizeInKB / 1024).toFixed(2)
    return fileSizeInMB
}

export function visualizePdf(pdfData) {
    let pdf = pdfData
    if (pdf.startsWith("data:application/pdf;base64,")) {
        pdf = pdf.replace('data:application/pdf;base64,', "")
    }

    let binaryString = window.atob(pdf)
    let len = binaryString.length
    let bytes = new Uint8Array(len)
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
    }

    let blob = new Blob([bytes], { type: 'application/pdf' })

    var url = URL.createObjectURL(blob)

    return url
}

export function errorHandler(error) {
    if (!error || typeof error !== 'object' || !error.Type || !Object.values(ErrorTypes).includes(error.Type)) {
        return error
    }

    let message

    switch (error.Type) {
        case ErrorTypes.INFORMATION_INCOMPLETE: {
            message = {
                Header: "Formulario Incompleto",
                Body: "Uno o más campos están vacíos",
                Content: error.MisingFields
            }
            break
        }
        default: {
            message = {
                Headers: "Error Desconocido",
                Body: "Hubo un error, vuelva a intentarlo"
            }
            break
        }
    }

    return message
}

export function loadNewPanel(panel) {
    const container = document.querySelector('#module-container')
    const thisPanel = document.querySelector('.form-container')

    if (!thisPanel) {
        container.appendChild(panel)
    }
}

export function togglePanelVisibility() {
    const sidePanel = document.querySelector('.form-container')

    if (sidePanel) {
        sidePanel.classList.toggle('form-active')
    }
}

export const ErrorTypes = Object.freeze({
    INFORMATION_INCOMPLETE: 'INFORMATION_INCOMPLETE',
    INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
    FILE_TOO_LARGE: 'FILE_TOO_LARGE',
    UNKNOWN_ERROR: 'UNKNOWN_ERROR',
    SERVER_ERROR: 'SERVER_ERROR'
})

export function handlerApiResponse(response, error, serverError) {
    if (response.response = 'ERROR') {
        return error
    }

    if (response.response = 'SERVER_ERROR') {
        return serverError
    }
}