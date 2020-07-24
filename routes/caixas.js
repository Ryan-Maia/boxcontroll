var express = require('express');
var router = express.Router();
const {db} = require('../modules/banco')
router.get('/',(req,res)=>{
    console.log(req.get('referer'));    
    res.render('pages/caixas/listar',{ layout: 'caixas' })
})
router.get('/inspecionar/:id',(req,res)=>{   
    db.all(`SELECT item.id id, categoria.nome categoria, item.nome nome FROM item,categoria ON item.categoria = categoria.id WHERE item.id IN (SELECT item_id FROM caixa_item WHERE caixa_id = ${req.params.id}) `,(err,rows)=>{
        db.get(`SELECT nome FROM caixa WHERE id = ${req.params.id}`,(err,row)=>{
            res.render('pages/caixas/inspecionar',{ layout: 'caixas', msg: req.flash('msg')[0] ,id:req.params.id,data:rows, nome: row});
        })
        
    })
});
router.get('/adicionarItem/:id',(req,res)=>{
    db.all(`SELECT * FROM item WHERE id NOT IN (SELECT item_id FROM caixa_item WHERE caixa_id = ${req.params.id});`,(err,rows)=>{
        res.render('pages/caixas/adicionarItem',{ layout: 'caixas', msg: req.flash('msg')[0] ,id:req.params.id, data:rows});
    });
    
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
// ITEMS DAS CAIXAS //
router.post('/adicionarItem',(req,res)=>{
    let item = req.body.item;
    let caixa = req.body.caixa;
    let quantidade = req.body.quantidade;
    let observacao = req.body.observacao;
    db.run(`INSERT INTO caixa_item (caixa_id,item_id,quantidade,observacao) VALUES (${caixa},${item},${quantidade},'${observacao}')`,(err)=>{
        if(err){
            console.log(err);
            if(err.errno === 19){
                req.flash('msg','ERROR!');
                res.redirect('/caixas/adicionarItem/'+caixa);
            }
        }else{
            req.flash('msg','Caixa cadastrada com sucesso!');
            res.redirect('/caixas/adicionarItem/'+caixa);
        }
    });
});
router.post('/removerItem/',(req,res)=>{
    let item_id = req.body.item_id;
    let caixa_id = req.body.caixa_id;
    db.run(`DELETE FROM caixa_item WHERE caixa_id = ${caixa_id} AND item_id = ${item_id}`,(err)=>{
        if(err){
            console.log(err);
        }
    });
});
module.exports = router;