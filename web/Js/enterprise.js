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

function createNewBranch() {
    const inputsSelectors = [{ selector : "#txtNombreSucursal" }]

    const inputsValues = getInputValues(inputsSelectors)

    if (inputsValues) {
        // ? Enviar mediante la API los valores
    }
}

function createNewJob() {
    const inputsSelectors = [{ selector : "#txtNombrePuesto"}]

    const inputsValues = getInputValues(inputsSelectors)

    if (inputsValues) {
        // ? Enviar mediante la API los valores
    }
}

function getInputValues(inputs) {
    const data = null

    inputs.forEach(input => {
        const element = document.querySelector(input.selector)

        if (element) {
            const value = verifyInputValue(element)

            if (value) {
                data = JSON.stringify({ "data": value })
            } else {
                alert("Formulario inconpleto...")
            }
        }

    })

    return data
}

function verifyInputValue(input) {
    if (input.value != '') {
        return input.value
    } else {
        return false
    }
}