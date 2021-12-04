// adicionando e instanciando o express no projeto
const express = require("express")
const app = express()

const date = require("date-and-time")

const exphbs = require("express-handlebars")
//chama o objedtID, sem isto o findOne nao entende
// por isto tem que passar
const ObjectId = require('mongodb').ObjectId

const LocalStorage = require('node-localstorage').LocalStorage
localStorage = new LocalStorage('./scratch')

const hbs = exphbs.create({
    partialsDir: ("views/partials/")
})


// trazendo a conexão do conexão pra cá
const client = require("./conexao")

// dbo = databaseObject
const dbo = client.db("Hospital")

// vinculando a engine
app.engine("handlebars", hbs.engine)

// setando a engine de visualização
app.set("view engine", "handlebars")

// definindo em qual porta será escutado
const porta = 3000

app.use(express.urlencoded())
app.use(express.json())

// dizendo ao express onde os arquivos estáticos estão
app.use(express.static(__dirname + "/public"))

localStorage.setItem("perfilLogado", "nulo")
localStorage.setItem("tipoPerfil", "nulo")

// Rota inicial direcionando para pagina de login
app.get("/", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    let x = localStorage.getItem("perfilLogado")
    if(tipoPerfil == "user"){
        // ele já está logado como user
        res.redirect("/cardsMedicos")
    }else if(tipoPerfil == "adm"){
        // ele já está logado como adm
        res.redirect("/listarMedico")
    }else{
        // ele não está logado
        res.render("login")
    }
})
//Fim rota inidial /


app.get("/login", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    let x = localStorage.getItem("perfilLogado")
    if(tipoPerfil == "user"){
        // ele já está logado como user
        res.redirect("/cardsMedicos")
    }else if(tipoPerfil == "adm"){
        // ele já está logado como adm
        res.redirect("/listarMedico")
    }else{
        // ele não está logado
        res.render("login")
    }
})

app.get("/logoff", (req, res) => {
    localStorage.setItem("perfilLogado", "nulo")
    localStorage.setItem("tipoPerfil", "nulo")
    res.redirect("/login")
})

app.post("/login", (req, res) => {
    let login = req.body.login
    let senha = req.body.senha

    dbo.collection("Login").findOne({login:login}, (erro, resultado) => {
        if (erro) throw erro
        console.log(resultado)
        if(resultado == null){
            // não achamos o login
            res.send("Não achamos seu login")
        }else if(senha == resultado.senha){
            // senha correta
            // usando o local storage para armazenar informações do perfil logado no sistema
            localStorage.setItem("perfilLogado", resultado.login)
            localStorage.setItem("tipoPerfil", resultado.tipo)
            if(resultado.tipo == "user"){
                // logou como user, vai pros cards
                res.redirect("/cardsMedicos")
            }else{
                // logou como adm, vai pro dashboard
                res.redirect("/listarMedico")
            }
        }else{
            // senha errada
            res.send("Senha incorreta")
        }
    })
})

app.get("/editarMedico/:id", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        var o_id = req.params.id
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection("medico").findOne({ _id: ObjectId(o_id) }, (err, resultado) => {
            if (err) throw err
            res.render("editarMedico", { resultado, perfilLogado })
        })
    }//else
})//editarMedico

app.post('/editarMedico', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{    
        let id = req.body.id
        let obj = {
            nome: req.body.nome,
            crm: req.body.crm,
            rg: req.body.rg,
            cpf: req.body.cpf,
            url: req.body.url,
            email: req.body.email,
            telefone: req.body.telefone,
            formacao: req.body.formacao
        }
        var newvalues = {
            $set: obj
        }

        // criarmos a newvalues setando, para forçar o obj virar um json, pois estava dando erro
        // no update não estava reconhecendo  obj como json antes
        var newvalues = { $set: obj
        }
        dbo.collection("medico").updateOne({_id:ObjectId(id)}, newvalues,(err, resultado) => {
            if (err) throw err
            res.redirect('/listarMedico')
        })
    }//else
})//editarMedico


app.get("/cadastrarMedico", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection("especialidade").find({}).toArray((erro, result) => {
            res.render("cadastrarMedico", {especialidades:result, perfilLogado})
        })
    }//else
})//cadastrarMedico

app.get("/listarMedico", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection('medico').find({}).toArray((err, resultado) => {
            if (err) throw err
            res.render("listaMedico", { medicos: resultado, perfilLogado })
        })
    }//else
})//listarMedico


// post para inserir um novo medico no banco de dados
app.post("/cadastrarMedico", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        const now = new Date();
        let dataAdmissao = date.format(now, "DD/MM/YYYY")

        let obj = {
            nome: req.body.nome,
            crm: req.body.crm,
            especialidade: req.body.especialidade,
            rg: req.body.rg,
            cpf: req.body.cpf,
            email: req.body.email,
            telefone: req.body.telefone,
            url: req.body.url,
            fo0o: req.body.formacao,
            data_admissao: dataAdmissao
        }
        // pesquisar na especialidade pra incrementar
        dbo.collection("especialidade").findOne({nome:req.body.especialidade}, (erro, resultado) =>{
            if (erro) throw erro
            resultado.qtdMedicos += 1
            let novo = {$set:resultado}
            dbo.collection("especialidade").updateOne({_id:resultado._id}, novo, (erro, resultado) =>{
                if(erro) throw erro
                dbo.collection("medico").insertOne(obj, (err, resultado) => {
                    if (err) throw err
                    console.log("1 médico foi inserido no BD")
                    res.redirect("/listarMedico")
                })//insere o medico
            })//atualiza a quantidade de medicos
        })//pesquisa a especialidade
    }//else
})//cadastrarMedico

app.get("/deletarMedico/:id", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let idMedico = req.params.id

        const objId = new ObjectId(idMedico)
        dbo.collection("medico").deleteOne({ _id: objId }, (erro, resultado) => {
            if (erro) throw erro
            res.redirect("/listarMedico")
        })
    }//else
})//deletarMedico

app.get("/cadastrarEspecialidade", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")
        res.render("cadastrarEspecialidade", {perfilLogado})
    }//else
})//cadastrarEspecialidade

app.post('/cadastrarEspecialidade', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        // por ql especialidade pesquisaremos
        let especialidade = req.body.nome

        // contando a quantidade de medicos que são dessa especialidade
        // var cont = 0
        dbo.collection("medico").countDocuments({especialidade:especialidade}, (erro, count) =>{
            if (erro) throw erro
            
            let obj = {
            nome: req.body.nome,
            categoria: req.body.categoria,
            codigo: req.body.codigo,
            local: req.body.local,
            planoSaude: req.body.planoSaude,
            qtdMedicos: count 
            }

            dbo.collection('especialidade').insertOne(obj, (erro, resultado) => {
                if (erro) throw erro
                res.redirect('/listarEspecialidade')
            })
        })
    }//else
})//cadastrarEspecialidade

app.get('/listarEspecialidade', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection('especialidade').find({}).toArray((erro, resultado) => {
            if (erro) throw erro
            res.render('listarEspecialidade', { especialidades: resultado, perfilLogado })
        })
    }//else
})//listarEspecialidade

app.get('/deletarEspecialidade/:id', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let idEspecialidade = req.params.id
        dbo.collection('especialidade').deleteOne({ _id: ObjectId(idEspecialidade) }, (erro, resultado) => {
            if (erro) throw erro
            res.redirect('/listarEspecialidade')
        })
    }//else
})//deletarEspecialidade

app.get('/editarEspecialidade/:id', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let o_id = req.params.id
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection('especialidade').findOne({ _id: ObjectId(o_id) }, (erro, resultado) => {
            if (erro) throw erro
            res.render('editarEspecialidade', { especialidade: resultado, perfilLogado })
        })
    }//else
})//editarEspecialidade

app.post('/editarEspecialidade', (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let id = req.body.id
        let obj = {
            nome: req.body.nome,
            categoria: req.body.categoria,
            codigo: req.body.codigo,
            local: req.body.local,
            planoSaude: req.body.planoSaude
        }
        var newvalues = {
            $set: obj
        }
        dbo.collection("especialidade").updateOne({ _id: ObjectId(id)}, newvalues, (err, resultado) => {
            if (err) throw err
            res.redirect('/listarEspecialidade')
        })
    }//else
})//editarEspecialidade

app.get("/listarMedico", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "user" || tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")
        dbo.collection('medico').find({}).toArray((err, resultado) => {
            if (err) throw err
            res.render("listaMedico", { medicos: resultado, perfilLogado })
        })
    }//else
})//listarMedico

app.get("/cardsMedicos", (req, res) => {
    let tipoPerfil = localStorage.getItem("tipoPerfil")
    if(tipoPerfil == "nulo"){
        res.render("erro")
    }else{
        let perfilLogado = localStorage.getItem("perfilLogado")

        dbo.collection("medico").find({}).toArray((err, resultado) => {
            if (err) throw err
            res.render("cardsMedicos", { medicos: resultado, perfilLogado })
        })
    }//else
})//listarMedico
//Criando variável para receber nome preenchido no input de busca por nome. Realizar busca na collection do banco de dados.
//renderizar resultado da busca.
app.post('/buscaNome', (req, res) =>{
    let nome = req.body.buscaNome
    dbo.collection('medico').find({'nome': new RegExp(nome, 'i')}).toArray((err, resultado)=>{
        if (err) throw err
        if (resultado.length == 0){
            let vazio = true
            res.render('cardsMedicos', {vazio})
        } else res.render('cardsMedicos', {medicos: resultado})
    })
})

app.post('/buscaEspecialidade', (req, res) =>{
    let especialidade = req.body.buscaEspecialidade
    dbo.collection('medico').find({'especialidade': new RegExp(especialidade, 'i')}).toArray((err, resultado)=>{
        if (err) throw err
        if (resultado.length == 0){
            let vazio = true
            res.render('cardsMedicos', {vazio})
        } else res.render('cardsMedicos', {medicos: resultado})
    })
})


app.listen(porta, () => {
    console.log("Sistema rodando na porta: [" + porta + "]")
})
