const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Lê os campos do formulário (application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// Serve arquivos estáticos: index.html, styles.css, etc.
app.use(express.static(__dirname));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.post("/salvar", (req, res) => {
  const { nome, email, senha } = req.body;
  if (!nome || !email || !senha) {
    return res.status(400).send("Campos obrigatórios faltando.");
  }

  const dir = path.join(__dirname, "dados");
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) {
      console.error("Erro ao criar pasta:", err);
      return res.status(500).send("Erro ao criar pasta.");
    }

    const linha = `Nome: ${nome} | Email: ${email} | Senha: ${senha}\n`;
    fs.appendFile(path.join(dir, "registros.txt"), linha, (err) => {
      if (err) {
        console.error("Erro ao salvar:", err);
        return res.status(500).send("Erro ao salvar os dados.");
      }
      res.send(`<h2>Dados salvos com sucesso!</h2><a href="/">Voltar</a>`);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
