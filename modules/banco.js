const sqlite3 = require('sqlite3').verbose();


const db = new sqlite3.Database('./banco.db',function(err){
    if (err) {
      return console.error(err.message);
    }
    db.run(`CREATE TABLE IF NOT EXISTS "caixa" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "nome" TEXT NOT NULL UNIQUE, "descricao" TEXT );`);
    db.run(`CREATE TABLE IF NOT EXISTS "categoria" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "nome" TEXT NOT NULL UNIQUE, "descricao" TEXT );`);
    db.run(`CREATE TABLE IF NOT EXISTS "item" ( "id" INTEGER PRIMARY KEY AUTOINCREMENT, "nome" TEXT NOT NULL UNIQUE, "categoria" INTEGER NOT NULL, FOREIGN KEY("categoria") REFERENCES "categoria"("id") );`);
    db.run(`CREATE TABLE IF NOT EXISTS "caixa_item" ( "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, "caixa_id" INTEGER NOT NULL, "item_id" INTEGER NOT NULL, "quantidade" NUMERIC NOT NULL, FOREIGN KEY("caixa_id") REFERENCES "caixa"("id"), FOREIGN KEY("item_id") REFERENCES "item"("id") );`);
    console.log('Connected to database.');
});

module.exports={sqlite3,db}