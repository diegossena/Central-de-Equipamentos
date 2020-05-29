"use strict";
const ldap=require('ldapjs')
const mysql=require('mysql')
const mssql=require('mssql')

const config={}

config.mysqlPool=mysql.createPool({
    host:'localhost',
    user:'root',
    password:'',
    database:'central_de_equipamentos',
    connectionLimit: 0,
})

config.ldapClient=()=>{
    return ldap.createClient({
        url: 'ldap://127.0.0.1:389',
        connectTimeout: 1000,
        reconnect: true
    })
}

config.mssqlPool=mssql.connect({
    user: 'sa',
    password: '625001',
    server: '192.168.0.201',
    port: 1433,
    database: 'admcopy',
    options: {
        encrypt: false,
        enableArithAbort: true
    }
})

config.motivosRetorno=['Não utilizado pelo Técnico','Retorno Homologação','Retorno Erro de Cadastro']
config.tecnicos=['Evaldo Borges','Igor Sapucaia','Jeferson Santos','Marcelo Tiago','Marcos Menezes','Paulo Ricardo','Rosangelo Garcez','Weliton Crispim','Diego Sena']

module.exports=config