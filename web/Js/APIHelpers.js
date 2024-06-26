/// Funciones de ayuda para obtencion de datos en las APIS

// -- EXPERIMENTAL (AUN NO SE USA) --
// Funcion que obtiene todos los datos de un API, pasando como parametro la URL de la API
export async function getAllData(url) {
    try {
        const response = await fetch(url)
        const json = await response.json()
        return json;
    } catch (error) {
        alert("Error al obtener la informacion, intentelo nuevamente")
    }
}

// -- EXPERIMENTAL (AUN NO SE USA) --
// Funcion para guardar los datos a una API mandando el contenido por el cuerpo, pasando como parametros la URL de la api, el nombre del parametro que recive, y el objeto Json con los datos
export async function saveObjectApiData(url, param, object) {
    const formData = new URLSearchParams()
    formData.append(param, JSON.stringify(object))

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
    }

    try {
        const response = await fetch(url, requestOptions)

        return response ? true : false;
    } catch (error) {
        alert("Error al guardar los datos, intentelo nuevamente")
    }
}

// esto sirve para realizar las peticiones
export async function makePeticion(url) {
    try {
        let response = await fetch(url);
        let json = await response.json();
        return json;
    } catch (error) {
        throw error;
    }
}

