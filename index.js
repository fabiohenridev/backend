const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');
const fs = require('fs'); // Para manipulação de arquivos

const PORT = process.env.PORT || 3000;

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Criando conexão com banco de dados
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "5tlmjt0f2C@",
  database: "use_db"
});

// Testar conexão com banco de dados
db.connect((err) => {
  if (err) {
    return console.error("Erro ao conectar banco de dados");
  }
  console.log("Sucesso ao conectar banco de dados");
});

app.post('/user', (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return res.json("Nome e email são obrigatórios");
  }

  const query = 'INSERT INTO users (nome, email) VALUES(?,?)';
  db.query(query, [nome, email], (err, result) => {
    if (err) {
      return res.json("Dados não inseridos no banco de dados");
    }
    res.json("Dados inseridos com sucesso");
  });
});

app.delete('/user', (req, res) => {
  const { nome, email } = req.body;

  if (!nome || !email) {
    return console.log("Nome e email são obrigatórios");
  }

  const query = 'DELETE FROM users WHERE nome = ? AND email = ?';
  db.query(query, [nome, email], (err, result) => {
    if (err) {
      return res.json("Erro ao deletar dados");
    }
    return res.json(nome + " apagado com sucesso");
  });
});

// Rota para download do arquivo
app.get('/download', (req, res) => {
  const filePath = path.join(__dirname, 'arquivos', 'meuarquivo.pdf'); // Ajuste conforme o caminho real
  const fileStat = fs.statSync(filePath); // Obter o tamanho do arquivo

  // Definindo os cabeçalhos corretamente
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=meuarquivo.pdf');
  res.setHeader('Content-Length', fileStat.size);  // Cabeçalho Content-Length

  // Enviando o arquivo
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error("Erro ao tentar baixar o arquivo:", err);
      res.status(500).send("Erro ao tentar baixar o arquivo");
    }
  });
});

// Testar rota para usuários
app.get('/', (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, result) => {
    if (err) {
      return res.json("Erro ao buscar dados");
    }
    res.json(result);
  });
});

// Iniciar o servidor
app.listen(PORT, () => {
  console.log(`Servidor conectado com sucesso na porta: ${PORT}`);
});
