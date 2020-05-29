"use strict";
const {mysqlPool,mssqlPool}=require('./config')
const printers=require('./models/printers')
const {sockets}=require('./sockets')

// Service: Entrada Máquina Estoque
mysqlPool.getConnection((err,conn)=>{
    if(err)console.log(err)
    conn.query(`SELECT MAX(M)CodMaquina,MAX(V)CodVisita FROM (SELECT MAX(CodMaquina)M,MAX(CodVisita)V FROM Estoque UNION ALL SELECT MAX(CodMaquina)M,MAX(CodVisita)V FROM PossivelMov)Codigos`,
    (err,results)=> {
        conn.release()
        let CodMaquina=14014,CodVisita=15667
		if(results){
			if(results[0].CodMaquina&&results[0].CodMaquina>CodMaquina)CodMaquina=results[0].CodMaquina;
			if(results[0].CodVisita&&results[0].CodVisita>CodVisita)CodVisita=results[0].CodVisita;
        }
        setInterval(()=>{
            mssqlPool.then(pool=>{
                pool.query(`SELECT CodMaquina,CodVisita,nserie Serial,Modelo,ContPB ContadorPB,ContadorColor FROM dbo.VisitaTecnica WHERE CodVisita>`+CodVisita+` AND (GrupoChamado='ATEND. INTERNO' OR GrupoChamado='PRESTADOR DE SERVICO') AND Situaçao='Baixado' ORDER BY CodVisita DESC`)
                .then(({recordset})=>{
                    if(recordset[0]){
                        CodVisita=recordset[0].CodVisita
                        recordset.forEach(row=>{
                            row.Tipo='USADA'
                            while(row.Serial!=(row.Serial=row.Serial.replace(' ','')));
							while(row.Serial!=(row.Serial=row.Serial.replace('\t','')));
                            printers.add(row,printer=>{
                                sockets.emit('entradaEstoque',printer)
                            })
                        })
                    }
                    pool.query(`SELECT CodMaquina,Nserie Serial,Modelo FROM dbo.CadMaqCliente WHERE CodMaquina>`+CodMaquina+` AND Cliente='GRUPOJRB - ESTOQUE LOCAL' ORDER BY CodMaquina DESC`)
                    .then(({recordset})=>{
                        if(recordset[0]){
                            CodMaquina=recordset[0].CodMaquina
                            recordset.forEach(row => {
                                row.Tipo='NOVA'
                                while(row.Serial!=(row.Serial=row.Serial.replace(' \t','')));
                                printers.add(row,printer=>{
                                    sockets.emit('entradaEstoque',printer)
                                })
                                CodMaquina=row.CodMaquina;
                            })
                        }
                    })
                })
            })
        },5000);
    })
})
// Service: Confirmação de saída
mysqlPool.getConnection((err,conn)=>{
    setInterval(()=>{
        conn.query(`SELECT Serial,DataModificacao FROM PossivelMov WHERE CodSolicitacao IS NULL`,
        (err,results)=> {
            if(results.length!=0){
                mssqlPool.then(pool=>{
                    let query=`SELECT SerieEquipTroca,CodSolicitacao,cliente,Reparo,localizaçaoMaquina,nserie,modelo,ContPB,ContadorColor,FezLeitura,ContPbTroca,ContColorTroca,DataAtendimento,HoraSolicitaçao FROM dbo.VisitaTecnica WHERE`
                    results[0].DataModificacao=new Date(results[0].DataModificacao).toLocaleDateString()
                    query+=`('`+results[0].DataModificacao+`'<=DataAtendimento AND SerieEquipTroca LIKE'%`+results[0].Serial+`%')`
                    for(let i=1;i<results.length;i++){
                        results[i].DataModificacao=new Date(results[i].DataModificacao).toLocaleDateString()
                        query+=`OR('`+results[i].DataModificacao+`'<=DataAtendimento AND SerieEquipTroca LIKE'%`+results[i].Serial+`%')`
                    }
                    pool.query(query)
                    .then(({recordset})=>{
                        let lastIndex=recordset.length-1
                        if(recordset.length!=0){
                            recordset.forEach((element)=>{
                                const dataAtendimento=moment.utc(element.datasolicitaçao).format('YYYY-MM-D')+' '+element.HoraSolicitaçao+':00'
                                if(element.ColorRetirado==''){
                                    element.ColorRetirado=0
                                }
                                if(element.ContColorTroca==''){
                                    element.ContColorTroca=0
                                }
                                if(element.ContadorColor==''){
                                    element.ContadorColor=0
                                }
                                if(element.SerieEquipTroca.length>0){
                                    query=`UPDATE PossivelMov SET CodSolicitacao='`+element.CodSolicitacao+`',ContadorPB='`+element.ContPbTroca+`',ContadorColor='`+element.ContColorTroca+`',Cliente='`+element.cliente+`',localizacao='`+element.localizaçaoMaquina+`',serialRetirado='`+element.nserie+`',modeloRetirado='`+element.modelo+`',PBRetirado='`+element.ContPB+`',ColorRetirado='`+element.ContadorColor+`',tipoMovimentacao='`+element.Reparo+`',PendenciaLeitura='`+element.FezLeitura+`',DataAtendimento='`+dataAtendimento+`',Fonte='SISTEMA' WHERE Serial LIKE'%`+element.SerieEquipTroca+`%'`
                                }else{
                                    query=''
                                }
                                conn.query(query,err=>{
                                    if(!err){
                                        sockets.emit('confirmed',{
                                            serial:element.SerieEquipTroca,
                                            contPB:element.ContPbTroca,
                                            contColor:element.ContColorTroca,
                                            tipoMov:element.Reparo,
                                            os:element.CodSolicitacao,
                                            cliente:element.cliente,
                                            equipRetirado:element.nserie,
                                            modeloRetirado:element.modelo,
                                            PBRetirado:element.ContPB,
                                            ColorRetirado:element.ContadorColor,
                                            localizacao:element.localizaçaoMaquina,
                                            pendLeitura:element.FezLeitura,
                                            dataAtendimento:dataAtendimento,
                                            Fonte:'SISTEMA',
                                        })
                                    }else{
                                        console.log(' UPDATE PossivelMov'+err.sqlMessage)
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    },5000)
})