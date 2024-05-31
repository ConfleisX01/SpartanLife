/// Funciones de ayuda

// Obtiene el HTML de un modulo, pasando como parametro la URL del archivo
export async function getModule(url) {
    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
        }

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