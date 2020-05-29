"use strict";
const app=require('./app')
const cookie=require('cookie')
const moment=require('moment')

const port=8080
const server=app.listen(8080,()=>{
    console.log('Servidor iniciado em http://localhost:'+port)
})
const sockets=require('socket.io')(server)
const jwt=require('jsonwebtoken')
// Models
const session=require('./models/session')
const printers=require('./models/printers')
const users=require('./models/users')
const {motivosRetorno,mysqlPool}=require('./config')

sockets.on('connection',socket=>{
    const uid=cookie.parse(socket.handshake.headers.cookie).uid
    jwt.verify(uid,session.secret,(err,decoded)=> {
        if(decoded){{
            printers.view(result=>{
                socket.emit('estoque',result)
            })
            printers.possivelMov(result=>{
                socket.emit('movimentacoes',result,motivosRetorno)
            })
            printers.historico(result=>{
                socket.emit('historicos',result)
            })
            socket.on('eventos',request=>{
                printers.eventos(request,result=>{
                    socket.emit('eventos',result)
                })
            })
            socket.on('confirmarSaida',printer=>{
                users.perms(decoded.username).then(perms=>{
                    if(perms.includes('movimentar')){
                        printers.searchPossivelMov(printer.serial).then(row=>{
                            row=row[0]
                            if(row.Fonte=='SISTEMA'){
                                if(printer.PBRetirado>0)row.PBRetirado=printer.PBRetirado
                                if(printer.ColorRetirado>0)row.ColorRetirado=printer.ColorRetirado
                                row.PendenciaLeitura=printer.pendenciaLeitura
                            }else{
                                row.tipoMovimentacao=printer.tipoMovimentacao
                                row.CodSolicitacao=printer.CodSolicitacao
                                row.Cliente=printer.cliente
                                row.serialRetirado=printer.serialRetirado
                                row.modeloRetirado=printer.modeloRetirado
                                if(printer.PBRetirado>0)row.PBRetirado=printer.PBRetirado
                                if(printer.ColorRetirado>0)row.ColorRetirado=printer.ColorRetirado
                                row.localizacao=printer.localizacao
                                row.PendenciaLeitura=printer.pendenciaLeitura
                                row.DataAtendimento=printer.dataAtendimento
                                row.Fonte=decoded.username
                            }
                            printers.addHistorico(row).then(()=>{
                                printers.removePossivelMov(row.Serial).then(()=>{
                                    sockets.emit('confirmarSaida',printer.serial)
                                }).catch(()=>{
                                    printers.removeHistorico(row.Serial)
                                })
                            }).catch(err=>{
                                socket.emit('warning',err)
                            })
                        })
                    }else{
                        socket.emit('warning','Sem Permissão')
                    }
                })
            })
            socket.on('salvar',printer=>{
                users.perms(decoded.username).then(perms=>{
                    if(perms.includes('movimentar')){
                        if(printer.CodSolicitacao>0){
                            printers.updatePossivelMov(printer,decoded.username).then(printer=>{
                                sockets.emit('salvar',printer)
                            })
                        }else{
                            socket.emit('warning','Insira Número da OS')
                        }
                    }else{
                        socket.emit('warning','Sem Permissão')
                    }
                })
            })
            socket.on('retornoEstoque',(printers,motivo)=>{
                if(err||!motivosRetorno.find(v=>v==motivo)){
                    socket.emit('warning','Sem Permissão')
                }else{
                    users.perms(decoded.username).then(perms=>{
                        if(perms.includes('movimentar')){
                            mysqlPool.getConnection((err,conn)=>{
                                let query
                                query=`SELECT CodMaquina,CodVisita,Serial,Modelo,Tipo,ContadorPB,ContadorColor FROM PossivelMov WHERE`
                                query+=` Serial LIKE '%`+printers[0]+`%'`
                                for(let i=1;i<printers.length;i++){
                                    query+=` OR Serial LIKE '%`+printers[i]+`%'`
                                }
                                query+=' LIMIT 0,25'
                                conn.query(query,
                                (err,results)=> {
                                    if(printers.length!=results.length||results.length==0)return socket.emit('warning','Equipamento Não Disponível');
                                    const keys=Object.keys(results[0])
                                    let lastIndex=results.length-1
                                    let obj={
                                        serials: [],
                                        motivo: motivo
                                    }
                                    results.forEach((element,index)=>{
                                        obj.serials.push(element.Serial)
                                        query='INSERT INTO Estoque('
                                        keys.forEach(value=>{
                                            query+=value+','
                                        })
                                        query=query.slice(0,query.length-1)+')VALUES('
                                        for(let i=0;i<keys.length;i++){
                                            query+=`'`+element[keys[i]]+`'`+`,`
                                        }
                                        query=query.slice(0,query.length-1)+')'
                                        conn.query(query,err=>{
                                            if(err)returnconsole.log(err.sqlMessage)
                                            conn.query(`DELETE FROM PossivelMov WHERE Serial='`+element.Serial+`'`,()=>{
                                                if(index==lastIndex){
                                                    conn.query(`INSERT INTO Eventos(UserName,Action,Object)VALUES('`+decoded.username+`','Retorno Estoque','`+JSON.stringify(obj)+`')`,
                                                    (err)=> {
                                                        conn.release()
                                                        if(err)console.log(err.sqlMessage)
                                                    })
                                                }
                                            })
                                            element.DataModificacao=moment().format('D/MM/YYYY HH:mm:ss')
                                            sockets.emit('retornoEstoque',element)
                                        })
                                    })
                                })
                            })
                        }else{
                            socket.emit('warning','Sem Permissão')
                        }
                    })
                }
            })
        }}
    })
})
module.exports={app,sockets}