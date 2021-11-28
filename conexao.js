const mongodb = require("mongodb").MongoClient
// const url = "mongodb+srv://lcsppaiva:2q6zspj9@cluster0.ntpfz.mongodb.net/Hospital?retryWrites=true&w=majority"
const url = 'mongodb+srv://elisaSantana:Pipoca24.@cluster0.g588m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'


// permite acessar as função do mongo
const client = new mongodb(url)

async function conectar(){
    try{
        await client.connect()
        console.log("Estamos conectados ao banco")
    }catch(err){
        console.log("erro ao conectar ao banco")
        console.log(err)
    }
}

// chamando a função para fazer o banco conectar
conectar()

// exportando a conexão do banco
module.exports = client

