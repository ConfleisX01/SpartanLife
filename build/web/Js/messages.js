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

export async function confirmMessage(title, text, btnConfirmText, responseTitle, resposeText) {
    const result = await Swal.fire({
        title: title,
        text: text,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: btnConfirmText
    });

    if (result.isConfirmed) {
        await Swal.fire({
            title: responseTitle,
            text: resposeText,
            icon: "success"
        });
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