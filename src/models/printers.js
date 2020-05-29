const {mysqlPool}=require('../config')
const moment=require('moment')

const printers={
    view:(callback)=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT Serial,Modelo,Tipo,ContadorPB,ContadorColor FROM Estoque ORDER BY DataModificacao DESC,Serial`,
            (err,result,fields)=>{
                conn.release()
                if(result[0]) return callback(result);
                result=[{}]
                fields.forEach(colunms => {
                    result[0][colunms.name]=null
                })
                return callback(result)
            })
        })
    },
    possivelMov:(callback)=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT * FROM possivelmov ORDER BY DataModificacao DESC,Serial`,
            (err,result,fields)=>{
                conn.release()
                if(result[0]) return callback(result);
                result=[{}]
                fields.forEach(colunms => {
                    result[0][colunms.name]=null
                })
                return callback(result)
            })
        })
    },
    historico:(callback)=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT * FROM Historico ORDER BY DataModificacao DESC,Serial`,
            (err,result,fields)=>{
                conn.release()
                if(result[0])return callback(result);
                result=[{}]
                fields.forEach(colunms => {
                    result[0][colunms.name]=null
                })
                return callback(result)
            })
        })
    },
    eventos:(serial,callback)=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT * FROM Eventos WHERE JSON_EXTRACT(Object,'$.serials','$[*].Serial') LIKE'%`+serial+`%' ORDER BY DataModificacao DESC LIMIT 0,100`,
            (err,result,fields)=>{
                conn.release()
                if(result[0]) return callback(result);
                result=[{}]
                fields.forEach(colunms => {
                    result[0][colunms.name]=null
                })
                return callback(result)
            })
        })
    },
    add:(printer,callback)=>{
        if(printer.ContadorPB.length==0)printer.ContadorPB=0
        if(printer.ContadorColor.length==0)printer.ContadorColor=0
        let query='INSERT INTO Estoque('
        Object.keys(printer).forEach(keys=>{
            query+=keys+','
        })
        query=query.slice(query,query.length-1)
        query+=')VALUES('
        for(value in printer){
            query+=`'`+printer[value]+`',`
        }
        query=query.slice(query,query.length-1)
        query+=')'
        mysqlPool.getConnection((err,conn)=>{
            if(err)console.log(err);
            conn.query(query,(err)=>{
				if(err)console.log(err.sqlMessage)
                conn.release()
                delete printer.CodMaquina
                delete printer.CodVisita
                printer.ContadorPB=0
                printer.ContadorColor=0
                if(!err)callback(printer)
            })
        })
    },
    updatePossivelMov:(printer,user)=>{
        return new Promise(resolve=>{
            mysqlPool.getConnection((err,conn)=>{
                conn.query(`SELECT Fonte FROM PossivelMov WHERE Serial LIKE'%`+printer.serial+`%'`,
                (err,result)=>{
                    console.log(printer)
                    if(!err){
                        let query='UPDATE PossivelMov SET'
                        // Cont PB Retirado
                        if(printer.PBRetirado.length==0){
                            printer.PBRetirado='0'
                        }
                        query+=` PBRetirado='`+printer.PBRetirado+`'`
                        // Cont Color Retirado
                        if(printer.ColorRetirado.length==0){
                            printer.ColorRetirado='0'
                        }
                        query+=`,ColorRetirado='`+printer.ColorRetirado+`'`
                        // Pendencia Leitura ?
                        query+=`,PendenciaLeitura=`
                        if(printer.pendenciaLeitura.length!=0){
                            query+=`'`+printer.pendenciaLeitura+`'`
                        }else{
                            query+='NULL'
                        }
                        if(result[0].Fonte!='SISTEMA'){
                            query+=`,tipoMovimentacaoimentacao=`
                            console.log(printer.tipoMovimentacao)
                            if(printer.tipoMovimentacao.length!=0){
                                query+=`'`+printer.tipoMovimentacao+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,CodSolicitacao=`
                            if(printer.CodSolicitacao.length!=0){
                                query+=`'`+printer.CodSolicitacao+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,Cliente=`
                            if(printer.cliente.length!=0){
                                query+=`'`+printer.cliente+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,serialRetirado=`
                            if(printer.serialRetirado.length!=0){
                                query+=`'`+printer.serialRetirado+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,modeloRetirado=`
                            if(printer.modeloRetirado.length!=0){
                                query+=`'`+printer.modeloRetirado+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,Localizacao=`
                            if(printer.localizacao.length!=0){
                                query+=`'`+printer.localizacao+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,DataAtendimento=`
                            if(printer.dataAtendimento.length!=0){
                                query+=`'`+printer.dataAtendimento+`'`
                            }else{
                                query+='NULL'
                            }
                            query+=`,Fonte='`+user+`'`
                            printer.fonte=user
                        }else{
                            printer.fonte='SISTEMA'
                        }
                        query+=` WHERE Serial LIKE '%`+printer.serial+`%'`
                        conn.query(query,(err)=> {
                            conn.release()
                            if(!err){
                                resolve(printer)
                            }else{
                                console.log(err.sqlMessage)
                            }
                        })
                    }
                })
            })
        })
    },
    searchPossivelMov:(serial)=>{
        return new Promise(resolve=>{
            mysqlPool.getConnection((err,conn)=>{
                conn.query(`SELECT * FROM possivelMov WHERE Serial LIKE'%`+serial+`%'`,
                (err,result)=>{
                    conn.release()
                    if(result[0])resolve(result);
                })
            })
        })
    },
    removePossivelMov:(serial)=>{
        return new Promise((resolve,reject)=>{
            mysqlPool.getConnection((err,conn)=>{
                conn.query(`DELETE FROM possivelMov WHERE Serial LIKE'%`+serial+`%'`,
                (err)=>{
                    conn.release()
                    if(!err){
                        resolve()
                    }else{
                        reject()
                    }
                })
            })
        })
    },
    addHistorico:(printer)=>{
        return new Promise((resolve,reject)=>{
            if(printer.ContadorPB.length==0)printer.ContadorPB=0
            if(printer.ContadorColor.length==0)printer.ContadorColor=0
            printer.DataModificacao=moment().format('YYYY-MM-D HH:mm:ss')
            if(printer.DataAtendimento)printer.DataAtendimento=moment.utc(printer.DataAtendimento).format('YYYY-MM-D HH:mm:ss')
            const keys=Object.keys(printer)
            let query='INSERT INTO Historico('
            query+=keys[0]
            for(let i=1;i<keys.length;i++){
                query+=','+keys[i]
            }
            query+=')VALUES('
            query+=`'`+printer[keys[0]]+`'`
            for(let i=1;i<keys.length;i++){
                if(printer[keys[i]]===''){
                    printer[keys[i]]=null
                }
                if(printer[keys[i]]){
                    query+=`,'`+printer[keys[i]]+`'`
                }else{
                    query+=`,`+printer[keys[i]]
                }
            }
            query+=')'
            mysqlPool.getConnection((err,conn)=>{
                conn.query(query,err=>{
                    conn.release()
                    if(!err){
                        resolve()
                    }else{
                        console.log(err.sqlMessage)
                        if(err.errno==1048){
                            let colunmErr=err.sqlMessage.split("'")[1]
                            if(colunmErr=='CodSolicitacao')colunmErr='OS'
                            reject(colunmErr+' não pode estar vazio')
                        }else{
                            reject('Inválido')
                        }
                    }
                })
            })
        })
    },
    removeHistorico:(serial)=>{
        return new Promise((resolve,reject)=>{
            mysqlPool.getConnection((err,conn)=>{
                conn.query(`DELETE FROM Historico WHERE Serial LIKE'%`+serial+`%'`,
                (err)=>{
                    conn.release()
                    if(!err){
                        resolve()
                    }
                })
            })
        })
    },
}

module.exports=printers