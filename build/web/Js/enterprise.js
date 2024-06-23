import * as msg from './messages.js'
import * as hlp from './helpers.js'
import * as APIhlp from './APIHelpers.js'

export function loadEnterpriseConfigurationModule(content) {
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
    const URL = 'http://localhost:8080/SpartanLife/api/sucursal/insertarSucursal'
    const inputsSelectors = [
        { selector: "#txtBranchName", key: "BranchName" },
        { selector: "#txtBranchAddress", key: "BranchAdress" }
    ]

    const inputsValues = await hlp.getInputValues(inputsSelectors)

    if (inputsValues != null) {
        let branch = createBranchJson(inputsValues)
        APIhlp.saveObjectApiData(URL, "sucursal", branch)
        msg.successMessage("Sucursal Creada", "La nueva sucursal ha sido creada con éxito.")
    } else {
        msg.errorMessage("Error", "Hubo un error al crear la sucursal", "Por favor, vuelve a intentarlo.")
    }
}

async function createNewJob() {
    const URL = 'http://localhost:8080/SpartanLife/api/puesto/insertarPuesto'
    const inputsSelectors = [{ selector: "#txtJobName", key : "jobName" }]

    const inputsValues = await hlp.getInputValues(inputsSelectors)

    if (inputsValues != null) {
        let job = createJobJson(inputsValues)
        APIhlp.saveObjectApiData(URL, "puesto", job)
        msg.successMessage("Puesto Creado", "El nuevo puesto ha sido creada con éxito.")
    } else {
        msg.errorMessage("Error", "Hubo un error al crear el puesto", "Por favor, vuelve a intentarlo.")
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
        "nombrePuesto" : job.jobName
    }

    return newJob
}