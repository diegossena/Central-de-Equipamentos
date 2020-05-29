"use strict";
const mysql = require('mysql')

const conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'',
})

conn.connect(function(err) {
    if (err) throw err;
    console.log("Connected in MySQL!")
    // Database
    conn.query('CREATE DATABASE central_de_equipamentos;',(err)=> {
        if (err){
            console.log("Database Exists")
        }else{
            console.log('CREATE DATABASE central_de_equipamentos')
        }
        // Tables
        conn.query('USE central_de_equipamentos',(err)=>{
            if(!err){
                conn.query('CREATE TABLE Users(UserName VARCHAR(64) NOT NULL,NickName VARCHAR(32) NOT NULL,Permission JSON NULL,Primary Key(UserName))ENGINE=InnoDB',(err)=> {
                    if (err){
                        console.log("TABLE Users Exists")
                    }else{
                        console.log('CREATE TABLE Users')
                    }
                    conn.query('CREATE TABLE Estoque(CodMaquina INT NOT NULL,CodVisita INT NOT NULL DEFAULT 0,Serial VARCHAR(64) NOT NULL,Modelo VARCHAR(64) NOT NULL,Tipo VARCHAR(5) NOT NULL,ContadorPB INT DEFAULT 0 NOT NULL,ContadorColor INT DEFAULT 0 NOT NULL,DataModificacao DateTime DEFAULT NOW() NOT NULL,Primary Key(CodMaquina))ENGINE=InnoDB',(err)=> {
                        if (err){
                            console.log("TABLE Estoque Exists")
                        }else{
                            console.log('CREATE TABLE Estoque')
                        }
                        conn.query(`CREATE TABLE possivelMov(CodMaquina INT NOT NULL,CodVisita INT NOT NULL,Serial VARCHAR(64) NOT NULL,Modelo VARCHAR(64) NOT NULL,Tipo VARCHAR(5) NOT NULL,ContadorPB INT  NOT NULL,ContadorColor INT NOT NULL,tipoSaida VARCHAR(40) NOT NULL,Requisitante VARCHAR(40) NOT NULL,DataModificacao DateTime DEFAULT NOW() NOT NULL,CodSolicitacao INT NULL DEFAULT NULL,Cliente VARCHAR(128) NULL,localizacao VARCHAR(64) NULL,serialRetirado VARCHAR(64) NULL,PBRetirado INT NULL,ColorRetirado INT NULL,modeloRetirado VARCHAR(60) NULL,tipoMovimentacao VARCHAR(64) NULL,PendenciaLeitura VARCHAR(3) NULL,DataAtendimento DATETIME NULL,Fonte VARCHAR(32) NULL,Primary Key(CodMaquina))ENGINE=InnoDB`,(err)=> {
                            if (err){
                                console.log("TABLE possivelMov Exists")
                            }else{
                                console.log('CREATE TABLE possivelMov')
                            }
                            conn.query('CREATE TABLE Eventos(ID INT AUTO_INCREMENT,UserName VARCHAR(64) NOT NULL,Action VARCHAR(64) NOT NULL,Object JSON NOT NULL,DataModificacao Datetime NOT NULL DEFAULT NOW(),FOREIGN KEY(UserName) REFERENCES Users(UserName),Primary Key(ID))ENGINE=InnoDB',(err)=> {
                                if (err){
                                    console.log("TABLE userLog Exists")
                                }else{
                                    console.log('CREATE TABLE userLog')
                                }
                                conn.query('CREATE TABLE Historico(CodMaquina INT NOT NULL,CodVisita INT NOT NULL,Serial VARCHAR(64) NOT NULL,Modelo VARCHAR(64) NOT NULL,Tipo VARCHAR(5) NOT NULL,ContadorPB INT NOT NULL,ContadorColor INT NOT NULL,tipoSaida VARCHAR(40) NOT NULL,Requisitante VARCHAR(40) NOT NULL,DataModificacao DateTime DEFAULT NOW() NOT NULL,CodSolicitacao INT NOT NULL,Cliente VARCHAR(128) NOT NULL,localizacao VARCHAR(64) NOT NULL,serialRetirado VARCHAR(64) NOT NULL,PBRetirado INT NOT NULL,ColorRetirado INT NOT NULL,modeloRetirado VARCHAR(60) NOT NULL,tipoMovimentacao VARCHAR(64) NOT NULL,PendenciaLeitura VARCHAR(3) NOT NULL,DataAtendimento DATETIME NOT NULL,Fonte VARCHAR(32) NOT NULL,Primary Key(CodMaquina))ENGINE=InnoDB',(err)=>{
                                    conn.end()
                                    if(err){
                                        console.log("TABLE Historico Exists")
                                    }else{
                                        console.log('CREATE TABLE Historico')
                                    }
                                })
                            })
                        })
                    })
                })
            }
        })
    })
})