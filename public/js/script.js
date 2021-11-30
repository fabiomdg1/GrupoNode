
function mostrarModal(mostrar){
    let modal = document.getElementById("modalAlerta")
    // $("#textoModal").text(textoErro)
    console.log(mostrar)
    new bootstrap.Modal(modal).show()
}

console.log('oi')