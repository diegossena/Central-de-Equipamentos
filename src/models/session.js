const jwt=require('jsonwebtoken')
const {ldapClient}=require('../config')
const users=require('./users')

const session={}

session.secret='621f831e68c5a55a4f8e9b58f40b83b8'
session.lifespan=28800

session.ldapAuth=(username,password)=>{
    return new Promise((resolve,reject)=>{
        const client=ldapClient()
        client.bind(username+'@jrb',password,(err)=> {
            client.destroy()
            if(err)return reject()
            users.nickname(username).then(nickname=>{
                let token=jwt.sign({username:username,nickname:nickname},session.secret,{expiresIn:session.lifespan})
                return resolve(token)
            }).catch(()=>{
                username=username.toLowerCase()
                users.register(username).then(nickname=>{
                    let token=jwt.sign({username:username,nickname:nickname},session.secret,{expiresIn:session.lifespan})
                    return resolve(token)
                }).catch(()=>reject())
            })
        })
    })
}

module.exports=session