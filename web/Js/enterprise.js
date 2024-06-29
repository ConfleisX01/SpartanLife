import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'
import { URL_BASE } from './config.js'

let html = null

export function loadEnterpriseConfigurationModule(content) {
    html = content
    applyContentOnModule(content)

    loadConfigControls()
}

function applyContentOnModule(content = null) {
    const container = document.querySelector('#module-container')

    if (content) {
        container.innerHTML = content
    } else {
        alert("Modulo no encontrado, vuelva a intentarlo...")
    }
}

function loadConfigControls() {
    const controls = [
        { selector: "#btnCreateBranch", handler: createNewBranch },
        { selector: "#btnCreateJob", handler: createNewJob }
    ]

    controls.forEach(control => {
        let element = document.querySelector(control.selector)

        if (element) {
            element.addEventListener('click', control.handler)
        } else {
            console.warn(`Elemento ${control.selector} no encontrado`)
        }
    })
}

async function createNewBranch() {
    const URL = URL_BASE + '/sucursal/insertarSucursal'
    const inputsSelectors = [
        { selector: "#txtBranchName", key: "BranchName", name: "Nombre de Sucursal" },
        { selector: "#txtBranchAddress", key: "BranchAdress", name: "Dirección de la sucursal" }
    ]

    const data = await hlp.getInputValues(inputsSelectors)

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newBranch = createBranchJson(response)

        let apiResponse = await APIhlp.saveObjectApiData(URL, "sucursal", newBranch)

        if (apiResponse.response) {
            msg.successMessage("Sucursal Creada", "La nueva sucursal ha sido creada con éxito.")
            loadEnterpriseConfigurationModule(html)
        } else {
            msg.errorMessage("Error", "Hubo un error al crear la sucursal", "Por favor, vuelve a intentarlo.")
        }
    }
}

async function createNewJob() {
    const URL = URL_BASE + '/puesto/insertarPuesto'
    const inputsSelectors = [{ selector: "#txtJobName", key: "jobName", name: "Nombre del Puesto" }]

    const data = await hlp.getInputValues(inputsSelectors)

    let response = hlp.errorHandler(data)

    if (response.Header) {
        msg.errorMessage(response.Header, response.Body, response.Content ? response.Content.join(', ') : "")
    } else {
        let newJob = createBranchJson(response)

        let apiResponse = await APIhlp.saveObjectApiData(URL, "puesto", newJob)

        if (apiResponse.response) {
            msg.successMessage("Puesto Creado", "El nuevo puesto ha sido creada con éxito.")
            loadEnterpriseConfigurationModule(html)
        } else {
            msg.errorMessage("Error", "Hubo un error al crear el puesto", "Por favor, vuelve a intentarlo.")
        }
    }
}

function createBranchJson(branch) {
    const newBranch = {
        "nombreSucursal": branch.BranchName,
        "direccion_sucursal": branch.BranchAdress
    }

    return newBranch
}

function createJobJson(job) {
    const newJob = {
        "nombrePuesto": job.jobName
    }

    return newJob
}