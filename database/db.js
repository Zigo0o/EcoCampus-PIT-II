
const { DatabaseSync } = require("node:sqlite");
const path = require("path");

const db = new DatabaseSync(
  path.join(__dirname, "ecocampus.db")
);

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
