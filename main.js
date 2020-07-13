const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const app = express()
const port = process.env.PORT || 3000
const categorias = require('./routes/categorias');
const caixas = require('./routes/caixas');
const itens = require('./routes/itens');
const flash = require('express-flash');
const session = require('express-session');

var ip = require("ip");
ip = ip.address();

app.set('view engine', 'ejs')     // Setamos que nossa engine será o ejs

app.use(session({
    secret: 'secret123',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.use(expressLayouts);

// ROTAS //
app.use('/categorias',categorias);
app.use('/caixas',caixas);
app.use('/itens',itens);

app.get('/', (req, res) => {
    res.render('pages/home')
    
})

app.listen(port, () => {
    console.log(`Box controll rodando em http://${ip}:${port}`)
})