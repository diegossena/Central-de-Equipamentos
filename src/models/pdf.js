"use strict";
const PDFDocument=require('pdfkit')
const moment=require('moment')
const {mysqlPool,mssqlPool}=require('../config')

const imgEntrada=new Buffer.alloc(4832,'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','base64')
const imgEstoque=new Buffer.alloc(7280,'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','base64')
const imgLogoJRB=new Buffer.alloc(9508,'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','base64')

const pdfDoc={}

let fontSize
pdfDoc.entrada=(codSolic)=>{
    return mssqlPool.then(pool=>{
        let query
        if(codSolic>0){
            query=pool.query('SELECT TOP 1 CodSolicitaçao,Cliente,observaçao,Modelo,nserie,localizaçaoMaquina,DataSolicitacao,DespachoTecnico,Reclamaçao FROM dbo.SolicitaçaoVisitaTecnica WHERE CodSolicitaçao='+codSolic)
        }else{
            query=pool.query('SELECT TOP 1 CodSolicitaçao,Cliente,observaçao,Modelo,nserie,localizaçaoMaquina,DataSolicitacao,DespachoTecnico,Reclamaçao FROM dbo.SolicitaçaoVisitaTecnica ORDER BY CodSolicitaçao DESC')
        }
        return query.then(result=>{
            return result.recordset[0]
        })
    }).then((result)=>{
        if(!result) return null;
        const doc=new PDFDocument({
            size: [368.55,283.5],
            margins: {
                top: 10,
                bottom: 0,
                left: 0,
                right: 0,
            }
        })
        doc.info['Title']='ENTRADA - ASSISTÊNCIA'
        doc.fontSize(20).text('ENTRADA - ASSISTÊNCIA',{
            align: 'center',
        })
        doc.image(imgEntrada,270,200)
        let fontBold='Helvetica-Bold'
        let fontStyle='Helvetica'
        fontSize=[11,10]
        let line=50
        let ln=25
        let colunmi=10
        doc
            .font(fontBold,fontSize[0])
            .text('Número OS:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.CodSolicitaçao,76,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Cliente:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Cliente,54,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Localização:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.localizaçaoMaquina,79,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Modelo:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Modelo,55,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Serial:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.nserie,47,line);
        line+=ln
        result.observaçao=result.observaçao.replace("\r\n",' ')
        doc
            .font(fontBold,fontSize[0])
            .text('Observação:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.observaçao,80,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Técnico:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.DespachoTecnico,58,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Causa do Chamado:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Reclamaçao,120,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Data de Abertura:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(moment.utc(result.DataSolicitacao).format('D/MM/YYYY'),105,line);
        // End
        return doc
    })
}

pdfDoc.pendenteLeitura=(codSolic)=>{
    return mssqlPool.then(pool=>{
        let query
        if(codSolic>0){
            query=pool.query('SELECT TOP 1 CodSolicitaçao,Cliente,observaçao,Modelo,nserie,localizaçaoMaquina,DataSolicitacao,DespachoTecnico,Reclamaçao FROM dbo.SolicitaçaoVisitaTecnica WHERE CodSolicitaçao='+codSolic)
        }else{
            query=pool.query('SELECT TOP 1 CodSolicitaçao,Cliente,observaçao,Modelo,nserie,localizaçaoMaquina,DataSolicitacao,DespachoTecnico,Reclamaçao FROM dbo.SolicitaçaoVisitaTecnica ORDER BY CodSolicitaçao DESC')
        }
        return query.then(result=>{
            return result.recordset[0]
        })
    }).then(result=>{
        if(!result) return null;
        const doc=new PDFDocument({
            size: [368.55,283.5],
            margins: {
                top: 10,
                bottom: 0,
                left: 0,
                right: 0,
            }
        });
        doc.info['Title']='ENTRADA - ASSISTÊNCIA'
        doc.fontSize(20).text('ENTRADA - ASSISTÊNCIA',{
            align: 'center',
        })
        doc.image(imgEntrada,270,200)
        let fontBold='Helvetica-Bold'
        let fontStyle='Helvetica'
        fontSize=[11,10]
        let line=50
        let ln=25
        let colunmi=10
        //
        doc
            .font(fontBold,fontSize[0])
            .text('Número OS:',colunmi,line)
            .text('PENDENTE LEITURA',235,line)
            .font(fontStyle,fontSize[1])
            .text(result.CodSolicitaçao,76,line)
            
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Cliente:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Cliente,54,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Localização:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.localizaçaoMaquina,79,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Modelo:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Modelo,55,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Serial:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.nserie,47,line);
        line+=ln
        result.observaçao=result.observaçao.replace("\r\n",' ')
        doc
            .font(fontBold,fontSize[0])
            .text('Observação:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.observaçao,80,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Técnico:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.DespachoTecnico,58,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Causa do Chamado:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Reclamaçao,120,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Data de Abertura:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(moment.utc(result.DataSolicitacao).format('D/MM/YYYY'),105,line);
        return doc
    })
}

pdfDoc.estoque=(codSolic)=>{
    return mssqlPool.then(pool=>{
        let query
        if(codSolic>0){
            query=pool.query('SELECT TOP 1 CodSolicitacao,DataAtendimento,Reclamaçao,Reparo,nserie,modelo,Tipo,ContPB,ContadorColor,GrupoChamado,Tecnico,Relato,Causa FROM dbo.VisitaTecnica WHERE CodSolicitacao='+codSolic+' ORDER BY NInterv DESC')
        }else{
            query=pool.query('SELECT TOP 1 CodSolicitacao,DataAtendimento,Reclamaçao,Reparo,nserie,modelo,Tipo,ContPB,ContadorColor,GrupoChamado,Tecnico,Relato,Causa FROM dbo.VisitaTecnica ORDER BY NInterv,CodSolicitacao DESC')
        }
        return query.then(result=>{
            return result.recordset[0]
        })
    }).then(result=>{
        if(!result) return null;
        const doc=new PDFDocument({
            size: [368.55,283.5],
            margins: {
                top: 10,
                bottom: 0,
                left: 0,
                right: 0,
            }
        })
        doc.info['Title']='ESTOQUE'
        doc.fontSize(20).text('ESTOQUE',{
            align: 'center',
        })
        doc.image(imgEstoque,260,10)
        let fontBold='Helvetica-Bold'
        let fontStyle='Helvetica'
        fontSize=[10,9]
        let line=20
        let ln=15
        let colunmi=10
        //
        doc
            .font(fontBold,fontSize[0])
            .text('Número OS:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.CodSolicitacao,70,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Data Atendimento:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(moment.utc(result.DataAtendimento).format('D/MM/YYYY'),100,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Serial:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.nserie,42,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Modelo:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.modelo,50,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Causa do Chamado:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Reclamaçao,110,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Reparo Realizado:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Reparo,100,line);
        line+=ln
        result.Relato=result.Relato.replace("\r\n",' ')
        doc
            .font(fontBold,fontSize[0])
            .text('Relato Técnico:',colunmi,line)
            .font(fontStyle,fontSize[1]-1)
            .text(result.Relato,85,line)
        line+=ln+20
        doc
            .font(fontBold,fontSize[0])
            .text('Causa do Defeito:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Causa,97,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Rechamado ?:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Tipo,80,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Contador P&B:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.ContPB,84,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Contador Cor:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.ContadorColor,80,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Grupo Atendimento:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.GrupoChamado,110,line);
        line+=ln
        doc
            .font(fontBold,fontSize[0])
            .text('Técnico:',colunmi,line)
            .font(fontStyle,fontSize[1])
            .text(result.Tecnico,53,line);
        line+=ln+5
        doc
            .font(fontBold,fontSize[0])
            .text('Teste de Rede?',colunmi,line)
            .rect(colunmi+80,line-5,15,15)
            .stroke()
            .text('Teste Bandeja Multiuso?',colunmi+100,line)
            .rect(colunmi+222,line-5,15,15)
            .stroke()
            .text('Teste de USB?',colunmi+240,line)
            .rect(colunmi+315,line-5,15,15)
            .stroke()
        line+=ln+5
        doc
            .font(fontBold,fontSize[0])
            .text('Teste de ADF?',colunmi+3,line)
            .rect(colunmi+80,line-5,15,15)
            .stroke()
            .text('Teste de Impressão? (Duplex&Simplex)',colunmi+100,line)
            .rect(colunmi+290,line-5,15,15)
            .stroke()
        return doc
    })
}

pdfDoc.ComprovSaidaEstoq=(id)=>{
    return new Promise(resolve=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT Object,DataModificacao FROM Eventos WHERE ID=`+id+` AND Action='Saida Estoque'`,
            (err,printers)=> {
                if(printers.length==0)return resolve(null);
                printers={
                    obj: JSON.parse(printers[0].Object),
                    DataModificacao: moment(printers.DataModificacao).format('D/MM/YYYY HH:mm:ss')
                }
                let query
                query=`SELECT Serial,Modelo,tipoSaida,requisitante FROM possivelMov WHERE`
                query+=` Serial LIKE '%`+printers.obj[0].Serial+`%'`
                for(let i=1;i<printers.obj.length;i++){
                    query+=` OR Serial LIKE '%`+printers.obj[i].Serial+`%'`
                }
                query+=' LIMIT 0,25'
                conn.query(query,
                (err,result)=> {
                    if(err||!result[0])return resolve(null)
                    conn.release()
                    // Definições
                    const doc=new PDFDocument({
                        size: 'A4',
                        autoFirstPage: false
                    })
                    doc.info['Title']='Comprovante de Saída Estoque'
                    let colunms=[[80,305],[90,315]]
                    for(let page=0;page<2;page++){
                        doc.addPage()
                        doc.image(imgLogoJRB,80,40,{height: 40})
                        // Table: Title
                        let rowInit=133
                        let row=rowInit
                        const height=15
                        let width=450
                        doc
                            .rect(80,row,width,height)
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text('Comprovante de Retirada de Equipamento do Estoque Local Grupo JRB',130,row+3)
                        // Table: rows
                        width=225
                        for(let i=0;i<3;i++){
                            row+=height
                            doc
                                .rect(colunms[0][0],row,width,height)
                                .rect(colunms[0][1],row,width,height)
                        }
                        // Table: cells
                        row=rowInit+height+3
                        doc
                            .font('Helvetica')
                            .text('Data:',colunms[1][0],row)
                            .text(printers.DataModificacao,colunms[1][1],row)
                        row+=height
                        doc
                            .text('Tipo de Saída:',colunms[1][0],row)
                            .text(result[0].tipoSaida,colunms[1][1],row)
                        row+=15
                        doc
                            .text('Requisitante:',colunms[1][0],row)
                            .text(result[0].requisitante,colunms[1][1],row)
                        // Table: Printers
                        row+=height
                        rowInit=row+height
                        for(let i=0;i<=result.length;i++){
                            row+=height
                            doc
                                .rect(colunms[0][0],row,width,height)
                                .rect(colunms[0][1],row,width,height)
                        }
                        row=rowInit+3
                        doc
                            .font('Helvetica-Bold')
                            .text('Serial',colunms[1][0]+80,row)
                            .text('Modelo',colunms[1][1]+80,row)
                        doc.font('Helvetica')
                        result.forEach(element => {
                            row+=height
                            doc.text(element.Serial,colunms[1][0],row)
                            doc.text(element.Modelo,colunms[1][1],row)
                        })
                        row+=height*3
                        doc
                            .font('Helvetica-BoldOblique')
                            .text('“Ao assinar este documento, declaro minha responsabilidade referente à retirada deste equipamento do Estoque Local do Grupo JRB, e a sua utilização”',colunms[0][0],row,{
                                align: 'center'
                            })
                        row+=height*5
                        doc
                            .moveTo(110,row)
                            .lineTo(280,row)
                            .moveTo(340,row)
                            .lineTo(510,row)
                        row+=height
                        doc
                            .font('Helvetica-Bold')
                            .fontSize(10)
                            .text('Assinatura do Requisitante',130,row)
                            .text('Assinatura Interna',380,row)
                        row+=height*2
                        doc
                            .font('Helvetica-Oblique')
                            .text('(se rubricar, favor colocar nome ao lado)',220,row)
                        doc.stroke()
                    }
                    resolve(doc)
                })
            })
        })    
    })
}

pdfDoc.identificacao=(codSolic)=>{
    return mssqlPool.then(pool=>{
        let query
        if(codSolic>0){
            query=pool.query('SELECT TOP 1 nserie FROM dbo.VisitaTecnica WHERE CodSolicitacao='+codSolic+' ORDER BY NInterv DESC')
        }else{
            query=pool.query('SELECT TOP 1 nserie FROM dbo.VisitaTecnica ORDER BY NInterv,CodSolicitacao DESC')
        }
        return query.then(result=>{
            return result.recordset[0]
        })
    }).then(result=>{
        if(!result) return null;
        const doc=new PDFDocument({
            size: [283.5,170.1],
            margins: {
                top: 10,
                bottom: 0,
                left: 0,
                right: 0,
            }
        })
        doc.info['Title']='Identificação'
        doc
            .font('Helvetica')
            .fontSize(25)
            .text('NS: '+result.nserie,0,50,{
                align: 'center'
            })
            .fontSize(12)
            .font('Helvetica')
            .text('ABERTURA DE CHAMADO ATRAVÉS DO SITE:',10,100)
            .font('Helvetica-Bold')
            .fontSize(12)
            .text('WWW.GRUPOJRB.COM.BR / Tel.: (71) 3288-3223',0,115,{
                align: 'center',
            })
            .text('Email: TECNICA@GRUPOJRB.COM.BR',0,130,{
                align: 'center',
            })
        return doc
    })
}

module.exports=pdfDoc