"use strict";
const app=require('./middleware')
const controllers=require('./controllers')
const {motivosRetorno,tecnicos}=require('./config')


app.get('/',controllers.logon)
app.get('/logout',controllers.logout)
app.post('/auth',controllers.auth)

app.get('/central',(req,res)=>res.redirect('/central/etiquetas'))
app.get('/central/etiquetas',(req,res)=>{
    res.render('central/etiquetas',{
        nickname:req.nickname
    })
})
app.get('/central/estoque',(req,res)=>{
    res.render('central/estoque',{
        nickname: req.nickname,tecnicos:tecnicos
    })
})
app.get('/central/saidaEstoque',controllers.saidaEstoque)
app.get('/central/movimentacoes',(req,res)=>{
    res.render('central/movimentacoes',{nickname: req.nickname,motivos:motivosRetorno})
})
app.get('/central/eventos',(req,res)=>{
    res.render('central/eventos',{
        nickname: req.nickname
    })
})
app.get('/central/historico',(req,res)=>{
    res.render('central/historico',{
        nickname: req.nickname
    })
})
app.get('/central/pdf',controllers.pdfGen)

module.exports=app