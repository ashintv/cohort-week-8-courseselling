const express = require('express')
const jwt = require('jsonwebtoken')
const { USER_JWT_KEY } = require('../config')



function UserAuthMiddleware(req,res,next){
        const token =  req.headers.token
        const decode = jwt.verify(token,USER_JWT_KEY)
        if(decode){
                req.body.id  = decode.id
                next()
        }
        else{
                res.status(400).json({
                        message:'You are not Signed in'
                })
        }

}

module.exports = {
        UserAuthMiddleware
}