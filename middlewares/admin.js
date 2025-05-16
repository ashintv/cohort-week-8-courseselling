const express = require('express')
const jwt = require('jsonwebtoken')
const { ADMIN_JWT_KEY } = require('../config')


function AdminAuthMiddleware(req, res, next) {
        const token = req.headers.token
        try {
                const decode = jwt.verify(token, ADMIN_JWT_KEY)
                if (decode) {
                        req.body.creator = decode.id
                        next()
                }
                else {
                        res.status(400).json({
                                message: 'You are not Signed in'
                        })
                }
        }
        catch(e){
                return res.status(400).json(e)
        }
}

module.exports = {
        AdminAuthMiddleware
}