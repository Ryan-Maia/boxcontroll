var express = require('express');
var router = express.Router();
const {db} = require('../modules/banco')
router.get('/',(req,res)=>{
    res.render('pages/categorias/listar');
})

router.get('/adicionar',(req,res)=>{
    res.render('pages/categorias/adicionar',{msg: req.flash('msg')[0]});
});
router.get('/alterar/:id',(req,res)=>{
    
    db.all(`SELECT * FROM categoria WHERE id LIKE ${req.params.id}`,(err,row)=>{
        console.log(row[0]);
        res.render('pages/categorias/alterar',{ msg: req.flash('msg')[0] , data: row[0] })
    })
    
})


router.post('/adicionar',(req,res)=>{
    let nome = req.body.nome;
    let desc = req.body.descricao;
    db.run(`INSERT INTO categoria (nome,descricao) VALUES ('${nome}','${desc}')`,(err)=>{
        if(err){
            console.log("ERR");
            console.log(err);
            if(err.errno === 19){
                req.flash('msg','Nome de categoria em uso!');
                res.redirect('/categorias/adicionar');
            }
        }else{
            console.log("NOT ERR");
            req.flash('msg','Categoria cadastrada com sucesso!');
            res.redirect('/categorias/adicionar');
        }
    });
});
router.post('/alterar',(req,res)=>{
    let id = req.body.id;
    let nome = req.body.nome;
    let desc = req.body.descricao;
    db.run(`UPDATE caixa SET nome = '${nome}', descricao = '${desc}' WHERE id = ${id}`,(err)=>{
        if(err){
            console.log(err);
            if(err.errno === 19){
                req.flash('msg','Nome de caixa em uso!');
                res.redirect('/categorias/alterar/' + id);
            }
        }else{
            req.flash('msg','Caixa alterada com sucesso!');
            res.redirect('/categorias/alterar/' + id);
        }
        
    });
});
router.post('/remover',(req,res)=>{
    let id = req.body.id;
    db.run(`DELETE FROM categoria WHERE id = ${id}`,(err)=>{
        if(err){
            res.send(false);
        }else{
            res.send(true);            
        }
    });
});
router.post('/list',(req,res)=>{    
    let query = `SELECT * FROM categoria WHERE nome LIKE '${req.body.pesquisa}%'`;
    db.all(query,(err,rows)=>{
        res.send({
            data: rows,
        });
    })
    
});

module.exports = router;