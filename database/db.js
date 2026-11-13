
const { DatabaseSync } = require("node:sqlite");
const path = require("path");
const fs = require("fs");

// Caminho do banco de dados
const dbPath = process.env.DB_PATH ||
  path.join(__dirname, "ecocampus.db");

// Garante que a pasta do banco exista
fs.mkdirSync(path.dirname(dbPath), { recursive: true });

// Abre ou cria o banco de dados
const db = new DatabaseSync(dbPath);

// Cria a tabela de respostas
db.exec(`
  CREATE TABLE IF NOT EXISTS respostas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    q1 TEXT NOT NULL,
    q2 TEXT NOT NULL,
    q3 TEXT NOT NULL,
    q4 TEXT NOT NULL,
    q5 TEXT NOT NULL,
    pontuacao INTEGER NOT NULL,
    data_envio TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
