const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./banco.db',function(err){
    if (err) {
      return console.error(err.message);
    }
    console.log('Connected to database.');
});
module.exports={sqlite3,db}