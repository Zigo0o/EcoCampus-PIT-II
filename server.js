
const express = require("express");
const path = require("path");
const db = require("./database/db");

const app = express();
const PORT = 3000;

// Permite receber dados em formato JSON
app.use(express.json());

// Disponibiliza os arquivos da pasta public
app.use(express.static(path.join(__dirname, "public")));

// Rota para salvar respostas
app.post("/api/respostas", (req, res) => {
  const { q1, q2, q3, q4, q5 } = req.body || {};
  const respostas = [q1, q2, q3, q4, q5];

  const opcoes = ["Sempre", "Às vezes", "Nunca"];

  // Valida todas as respostas recebidas
  const validas = respostas.every(
    resposta => opcoes.includes(resposta)
  );

  if (!validas) {
    return res.status(400).json({
      erro: "Todas as perguntas devem ter respostas válidas."
    });
  }

  // Calcula a pontuação no servidor
  const pontos = {
    "Sempre": 2,
    "Às vezes": 1,
    "Nunca": 0
  };

  const pontuacao = respostas.reduce(
    (total, resposta) => total + pontos[resposta],
    0
  );

  try {
    // Salva as respostas no SQLite
    const comando = db.prepare(`
      INSERT INTO respostas
      (q1, q2, q3, q4, q5, pontuacao)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    const resultado = comando.run(
      q1, q2, q3, q4, q5, pontuacao
    );

    res.status(201).json({
      mensagem: "Respostas salvas com sucesso!",
      id: Number(resultado.lastInsertRowid),
      pontuacao: pontuacao
    });

  } catch (erro) {
    console.error("Erro ao salvar respostas:", erro);

    res.status(500).json({
      erro: "Não foi possível salvar as respostas."
    });
  }
});

 // Rota para consultar as estatísticas do EcoCampus
app.get("/api/estatisticas", (req, res) => {
  try {
    // Consulta o total e a média das pontuações
    const resumo = db.prepare(`
      SELECT
        COUNT(*) AS total,
        ROUND(AVG(pontuacao), 1) AS media
      FROM respostas
    `).get();

    // Consulta a distribuição das pontuações
    const faixas = db.prepare(`
      SELECT
        SUM(CASE WHEN pontuacao BETWEEN 0 AND 4
            THEN 1 ELSE 0 END) AS baixo,
        SUM(CASE WHEN pontuacao BETWEEN 5 AND 7
            THEN 1 ELSE 0 END) AS medio,
        SUM(CASE WHEN pontuacao BETWEEN 8 AND 10
            THEN 1 ELSE 0 END) AS alto
      FROM respostas
    `).get();

    res.json({
      total: resumo.total,
      media: resumo.media ?? 0,
      baixo: faixas.baixo ?? 0,
      medio: faixas.medio ?? 0,
      alto: faixas.alto ?? 0
    });

  } catch (erro) {
    console.error("Erro ao consultar estatísticas:", erro);

    res.status(500).json({
      erro: "Não foi possível consultar as estatísticas."
    });
  }
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`EcoCampus funcionando em http://localhost:${PORT}`);
});
