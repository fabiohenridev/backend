const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const PORT = process.env.PORT || 3000;

const app = express();

//middware
app.use(express.json())
app.use(cors());


// Criando conexão com banco de dados

const db = mysql.createConnection({

host: "localhost",
user: "root",
password: "5tlmjt0f2C@",
database: "use_db"

})

// testar conexão banco de dados

db.connect((err)=>{

if(err){
   return console.error("erro ao conectar banco de dados");
}

console.log("sucesso ao conectar banco de dados");

});

app.post('/user', (req, res)=>{

const {nome, email} = req.body;

if(!nome || !email){
    res.json("nome e email são obrigatorios")
}

const query = 'INSERT INTO users (nome, email) VALUES(?,?)';

db.query(query, [nome, email], (err, result)=>{
    if(err){
        return res.json("dados não inseridos no banco de dados")
    }

    res.json("dados inseridos com sucesso");
})



})


app.get('/download', (req, res)=>{


const filePath = path.join(__dirname, 'Arquivos', 'ganharOnline.pdf');

res.download(filePath, (err)=>{
    if(err){
        console.error('erro ao baixar arquivo', err);
        res.send('erro ao tentar baixar arquivo')
    }
})


})

// a rota delete é a mesma coisa da rota post. A diferença é o comando sql

app.delete('/user', (req, res)=>{

const {nome, email} = req.body;

if(!nome || !email){
return console.log("nome e email são obrigatórios")
}

const query = 'DELETE FROM users WHERE nome = ? AND email = ?';

db.query(query, [nome, email], (err, result)=>{
    if(err){
        return res.json("erro ao deletar dados")
    }

   return res.json(nome + " apagado com sucesso");
})

})




app.get('/', (req, res)=>{

const query = 'SELECT * FROM users';

db.query(query, (err, result)=>{
    if(err){
        return res.json("erro ao buscar dados")
    }

    res.json(result);
})

})




app.listen(PORT, ()=>{
    console.log(`servidor conectado com sucesso na porta: ${PORT}`);
})