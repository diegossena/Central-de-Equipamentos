"use strict";
const {sockets}=require('./sockets')
const session=require('./models/session')
const {mysqlPool,tecnicos}=require('./config')
const moment=require('moment')

var controllers={}

controllers.logon=(req,res)=>{
    if (req.cookies.uid)return res.redirect('/central');
    res.render('logon.ejs')
}

controllers.logout=(req,res)=>{
    res.setHeader('Set-Cookie','uid=;expires='+Date())
    res.redirect('/')
}

controllers.auth=(req,res) => {
    if (!req.body.username) {
        res.status(400).send({auth:false,message:"Usuário é necessário"})
    }else if(!req.body.password || req.body.password.length==0){
        res.status(400).send({auth:false,message:"Senha é necessária"})
    }else{
        session.ldapAuth(req.body.username,req.body.password).then(token=>{
            console.log(req.body.username)
            if(token){
                res.setHeader('Set-Cookie','uid='+token+';HttpOnly;max-age='+session.lifespan)
                res.status(200).send({auth:true,uid: token})
            }else{
                res.status(401).send({auth:false,message:"Usuário ou senha inválidos."})
            }
        })
    }
}

// /Central/saidaEstoque
controllers.saidaEstoque=(req,res) => {
    if(req.perms.includes('movimentar')&&req.query.tipoDeSaida&&tecnicos.includes(req.query.requisitante)&&Array.isArray(req.query.serials)){
        mysqlPool.getConnection((err,conn)=>{
            let query
            query=`SELECT * FROM Estoque WHERE`
            query+=` Serial='`+req.query.serials[0]+`'`
            for(let i=1;i<req.query.serials.length;i++){
                query+=` OR Serial='`+req.query.serials[i]+`'`
            }
            query+=' LIMIT 0,25'
            conn.query(query,
            (err,printers)=> {
                if(req.query.serials.length!=printers.length)return res.end('Equipamento Indisponivel');
                let obj=[]
                let lastIndex=printers.length-1
                const keys=Object.keys(printers[0])
                printers.forEach((element,index)=>{
                    element.DataModificacao=moment(element.DataModificacao).format('YYYY-MM-D HH:mm:ss')
                    obj.push({
                        Serial: element.Serial,
                        ContadorPB: element.ContadorPB,
                        ContadorColor: element.ContadorColor
                    })
                    query='INSERT INTO possivelmov('
                    keys.forEach(value => {
                        query+=value+','
                    })
                    query+='tipoSaida,requisitante)VALUES('
                    for (const key in element) {
                        query+=`'`+element[key]+`',`
                    }
                    query+=`'`+req.query.tipoDeSaida+`','`+req.query.requisitante+`');`
                    conn.query(query,err=>{
                        if(err) console.log(err);
                        conn.query(`DELETE FROM Estoque WHERE Serial='`+element.Serial+`'`,()=>{
                            if(index==lastIndex){
                                conn.query(`INSERT INTO Eventos(UserName,Action,Object)VALUES('`+req.username+`','Saida Estoque','`+JSON.stringify(obj)+`')`,
                                (err,results)=> {
                                    conn.release()
                                    if(err) console.log(err);
                                    res.redirect('/central/pdf?type=ComprovSaidaEstoq&id='+results.insertId)
                                })
                            }
                        })
                        element.tipoSaida=req.query.tipoDeSaida
                        element.Requisitante=req.query.requisitante
                        sockets.emit('saidaEstoque',element)
                    })
                })
            })
        })
    }else{
        res.status(401).end('Sem Permissao')
    }
}
const pdfDoc=require('./models/pdf')
controllers.pdfGen=(req,res)=>{
    if(Object.keys(pdfDoc).includes(req.query.type)){
        let command=pdfDoc[req.query.type]
        const doc=command(req.query.id)
        doc.then(doc=>{
            if(doc){
                doc.pipe(res)
                doc.end()
            }else{
                res.status(404).end()
            }
        })
    }else{
        res.status(404).end()
    }
}

module.exports=controllers