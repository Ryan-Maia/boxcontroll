var express = require('express');
var router = express.Router();
const {db} = require('../modules/banco')
router.get('/',(req,res)=>{
    console.log(req.get('referer'));    
    res.render('pages/caixas/listar',{ layout: 'caixas' })
})
router.get('/inspecionar/:id',(req,res)=>{   
    
    db.all(`SELECT * FROM caixa_item WHERE caixa_id = ${req.params.id}`,(err,rows)=>{
        console.log(rows);
        res.render('pages/caixas/inspecionar',{ layout: 'caixas', msg: req.flash('msg')[0] });
    })
    
});
router.get('/adicionarItem',(req,res)=>{
    res.render('pages/caixas/adicionarItem',{ layout: 'caixas', msg: req.flash('msg')[0] });
});
router.get('/adicionar',(req,res)=>{
    res.render('pages/caixas/adicionar',{ layout: 'caixas', msg: req.flash('msg')[0] });
});  
router.get('/alterar/:id',(req,res)=>{
    
    db.all(`SELECT * FROM caixa WHERE id LIKE ${req.params.id}`,(err,row)=>{
        console.log(row[0]);
        res.render('pages/caixas/alterar',{ layout: 'caixas', msg: req.flash('msg')[0] , data: row[0] })
    })
    
});


router.post('/adicionar',(req,res)=>{
    let nome = req.body.nome;
    let desc = req.body.descricao;
    db.run(`INSERT INTO caixa (nome,descricao) VALUES ('${nome}','${desc}')`,(err)=>{
        if(err){
            console.log(err);
            if(err.errno === 19){
                req.flash('msg','Nome de caixa em uso!');
                res.redirect('/caixas/adicionar');
            }
        }else{
            req.flash('msg','Caixa cadastrada com sucesso!');
            res.redirect('/caixas/adicionar');
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
                res.redirect('/caixas/alterar/' + id);
            }
        }else{
            req.flash('msg','Caixa alterada com sucesso!');
            res.redirect('/caixas/alterar/' + id);
        }
        
    });
});
router.post('/remover',(req,res)=>{
    let id = req.body.id;
    db.run(`DELETE FROM caixa WHERE id = ${id}`,(err)=>{
        if(err){
            res.send(false);
        }else{
            res.send(true);            
        }
    });
});
router.post('/list',(req,res)=>{
    
        
    let query = `SELECT * FROM caixa WHERE nome LIKE '${req.body.pesquisa}%'`;
    
    db.all(query,(err,rows)=>{
        res.send({
            data: rows,
        });
    })
    
});
module.exports = router;