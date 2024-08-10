export function questionMessage(title, text) {
    Swal.fire({
        title: title,
        text: text,
        icon: "question"
    })
}

export function errorMessage(title, text, help) {
    Swal.fire({
        icon: "error",
        title: title,
        text: text,
        footer: help
    })
}

export async function confirmMessage(title, text, btnConfirmText) {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonText: 'Cancelar',
        cancelButtonColor: "#d33",
        confirmButtonText: btnConfirmText
    });

    const container = document.querySelector('body')
    container.classList.remove('swal2-height-auto')

    if (result.isConfirmed) {
        // await Swal.fire({
        //     title: responseTitle,
        //     text: resposeText,
        //     icon: "success"
        // });
        return true;
    } else {
        return false;
    }
}

export function successMessage(title, help) {
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: title,
        footer: help,
        showConfirmButton: false,
        timer: 1500
    })
}

export function showImage(url) {
    Swal.fire({
        title: 'Visualizador de Imagen',
        imageUrl: url,
        imageHeight: 500,
        imageAlt: "Image",
        padding: '1rem'
    })
}

export function showFrame(url) {
    Swal.fire({
        title: 'Visualizador de PDF',
        html: `<iframe id="pdfViewer" src="${url}" width="750px" height="500px"></iframe>`,
        width: 800,
        showCloseButton: true,
    })
}

export function inputMessage() {
    return Swal.fire({
        title: 'Ingresa la URL de la API (FUNCION DE DESARROLLADOR)',
        input: 'text',
        inputPlaceholder: 'Escribe aquí...',
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingresa un valor.'
            }
        }
    }).then((result) => {
        if (result.isConfirmed) {
            return result.value
        }
    })
}