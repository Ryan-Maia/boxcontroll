var express = require('express');
var router = express.Router();
const {db} = require('../modules/banco')

router.get('/',(req,res)=>{
    res.render('pages/itens/listar',{ layout: 'itens' })
})

router.get('/adicionar',(req,res)=>{
    db.all(`SELECT * FROM categoria`,(err,row)=>{        
        res.render('pages/itens/adicionar',{ layout: 'itens', msg: req.flash('msg')[0], categorias: row});
    })
});
router.get('/alterar/:id',(req,res)=>{
    db.all(`SELECT * FROM categoria`,(err,categorias)=>{
        db.all(`SELECT * FROM item WHERE id LIKE ${req.params.id}`,(err,row)=>{
            res.render('pages/itens/alterar',{ layout: 'itens', msg: req.flash('msg')[0], categorias: categorias, dados:row[0] });
        })
        
    })


    
    
})


router.post('/adicionar',(req,res)=>{
    let nome = req.body.nome;
    let categoria = req.body.categoria;
    db.run(`INSERT INTO item (nome,categoria) VALUES ('${nome}','${categoria}')`,(err)=>{
        if(err){
            console.log("ERR");
            console.log(err);
            if(err.errno === 19){
                req.flash('msg','Nome de item em uso!');
                res.redirect('/itens/adicionar');
            }
        }else{
            console.log("NOT ERR");
            req.flash('msg','Item cadastrado com sucesso!');
            res.redirect('/itens/adicionar');
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
    
    db.all(`SELECT item.id id, item.nome nome, categoria.nome categoria FROM item JOIN categoria ON categoria.id = item.categoria WHERE item.nome LIKE '${req.body.pesquisa}%'`,(err,rows)=>{
        res.send({
            data: rows,
        });
    })
    
});

module.exports = router;