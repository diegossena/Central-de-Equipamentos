"use strict";
const express=require('express')
const app=express()
const path=require('path')
const cookieParser=require('cookie-parser')

app.use(express.static(path.join(__dirname,'../public')))
app.set('views',path.join(__dirname,'../views'))
app.set('view engine','ejs')

app.use(cookieParser()) // for parsing cookies
app.use(express.json()) // for parsing application/json

module.exports=app