function mostrarModal(noh){
    // corpo do modal
    let modal = document.getElementById("modalAlerta")
    // $("#textoModal").text(textoErro)
    let lista = noh.querySelectorAll("input")
    // nome, email, crm, especialidade, formação
    let nome = lista[0].value
    let email = lista[1].value
    let crm = lista[2].value
    let especialidade = lista[3].value
    let formacao = lista[4].value

    // titulo do modal
    let tituloModal= document.getElementById("tituloModal")
    tituloModal.innerHTML = "Dr " + nome

    // corpo do modal
    let campoTxt = document.getElementById("corpoModal")
    // limpando o conteudo do corpo para não ficar dando append com o conteudo anterior
    campoTxt.innerHTML = ""
    // campo nome
    let no = document.createElement("p")
    let txt = document.createTextNode("Nome: " + nome)
    no.appendChild(txt);
    campoTxt.appendChild(no)

    // campo email
    no = document.createElement("p")
    txt = document.createTextNode("Email: " + email)
    no.appendChild(txt);
    campoTxt.appendChild(no)

    // campo CRM
    no = document.createElement("p")
    txt = document.createTextNode("CRM: " + crm)
    no.appendChild(txt);
    campoTxt.appendChild(no)

    // campo Especialidade
    no = document.createElement("p")
    txt = document.createTextNode("Especialidade: " + especialidade)
    no.appendChild(txt);
    campoTxt.appendChild(no)

    // campo formação
    no = document.createElement("p")
    txt = document.createTextNode("Formação: " + formacao)
    no.appendChild(txt);
    campoTxt.appendChild(no)

    new bootstrap.Modal(modal).show()
}