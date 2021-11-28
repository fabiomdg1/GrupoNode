const mongodb = require("mongodb").MongoClient
const url = require("./url")

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


