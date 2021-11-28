// adicionando e instanciando o express no projeto
const express = require("express")
const app = express()

const date = require("date-and-time")

const exphbs = require("express-handlebars")

const ObjectId = require('mongodb').ObjectId

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
app.use(express.static(__dirname + "public"))


app.get("/login", (req, res) => {
    res.send("entrei no home")
})

app.get("/editarMedico/:id", (req, res) => {
    var o_id = req.params.id
    
    dbo.collection("medico").findOne({_id:ObjectId(o_id)}, (err, resultado) => {
        if (err) throw err 
        
        res.render("editarMedico",{resultado})

    })
        
})

app.post('/editarMedico',(req, res)=>{
    let id = req.body.id
    let obj = {nome:req.body.nome,
               crm:req.body.crm,
               rg:req.body.rg,
               cpf:req.body.cpf,
               email:req.body.email,
               telefone:req.body.telefone,
               formacao:req.body.formacao
    }
    var newvalues = { $set: obj
     }
    dbo.collection("medico").updateOne({_id:ObjectId(id)}, newvalues,(err, resultado) => {
        if (err) throw err
        res.redirect('/listarMedico')
    })

})


app.get("/cadastrarMedico", (req, res) => {
    res.render("cadastrarMedico")
})

app.get("/listarMedico", (req, res) => {
    dbo.collection('medico').find({}).toArray((err,resultado) => {
        if (err) throw err
        res.render("listaMedico",{medicos:resultado})
        
    })

})


// post para inserir um novo medico no banco de dados
app.post("/cadastrarMedico", (req, res) => {
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
        formacao: req.body.formacao,
        data_admissao: dataAdmissao        
    }

    dbo.collection("medico").insertOne(obj, (err, resultado) => {
        if (err) throw err
        console.log("1 médico foi inserido no BD")
        res.redirect("/login")
    })
})

app.get("/cadastrarEspecialidade", (req, res) => {
    res.render("cadastrarEspecialidades")
})



app.listen(porta, () =>{
    console.log("Sistema rodando na porta: [" + porta + "]")
})