"use strict";
const jwt=require('jsonwebtoken')
const session=require('./models/session')
const users=require('./models/users')
const {app}=require('./sockets')

const sessionVerify=(req,res,next) => {
    if (!req.cookies.uid) return res.status(401).redirect('/');
    jwt.verify(req.cookies.uid,session.secret,(err,{username,nickname})=> {
        if (err) return res.status(401).redirect('/')
        users.perms(username).then(perms=>{
            req.perms=perms
            req.username=username
            req.nickname=nickname
            next()
        }).catch(()=>res.redirect('/'))
    })
}
app.use('/central',sessionVerify)

module.exports=app