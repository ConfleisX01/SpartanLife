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
        if(input.value.trim() === '') {
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

export function imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
    })
}

export async function getInputValues(inputs) {
    let data = {}

    for (const input of inputs) {
        const element = document.querySelector(input.selector)

        if (element) {
            const value = await verifyInputValue(element)

            if (value) {
                data[input.key] = value
            } else {
                return null
            }
        }
    }

    return data
}

async function verifyInputValue(input) {
    if (input.type === 'file') {
        if (input.files.length > 0) {
            return await imageToBase64(input.files[0])
        } else {
            return false
        }
    } else {
        if (input.value != '') {
            return input.value
        } else {
            return false
        }
    }
}