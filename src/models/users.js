const {mysqlPool}=require('../config')

const users={}

users.register=(username)=>{
    return new Promise((resolve,reject)=>{
        let aux=username.split('.')
        let NickName=''
        aux.forEach(element => {
            NickName+=' '+element[0].toUpperCase()+element.substring(1).toLowerCase()
        })
        NickName=NickName.substr(1)
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`INSERT INTO Users(UserName,NickName,Permission)VALUES('`+username+`','`+NickName+`','[]')`,
            err=>{
                conn.release()
                if(!err){
                    return resolve(NickName)
                }else{
                    return reject()
                }
            })
        })
    })
}

users.nickname=(username)=>{
    return new Promise((resolve,reject)=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT NickName FROM Users WHERE UserName='`+username+`'`,
            (err,results)=> {
                conn.release()
                if(results[0]){
                    return resolve(results[0].NickName)
                }else{
                    return reject()
                }
            })
        })
    })
}

users.perms=(username)=>{
    return new Promise(resolve=>{
        mysqlPool.getConnection((err,conn)=>{
            conn.query(`SELECT Permission FROM Users WHERE UserName='`+username+`'`,
            (err,results)=> {
                conn.release()
                if(results[0]){
                    resolve(JSON.parse(results[0].Permission))
                }else{
                    console.log(err.sqlMessage)
                }
            })
        })
    })
}

users.editPerms=(username,newPermission=[])=>{
    newPermission=JSON.stringify(newPermission)
    mysqlPool.getConnection((err,conn)=>{
        conn.query(`UPDATE Users SET Permission='`+newPermission+`' WHERE UserName='`+username+`'`,()=>conn.release())
    })
}

module.exports=users