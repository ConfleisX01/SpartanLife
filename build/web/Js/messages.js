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