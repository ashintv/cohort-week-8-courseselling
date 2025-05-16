
const { Router } = require('express')
const express = require('express')
const UserRouter = Router()
const { UserModel } = require('../db')
const { z } = require('zod')
const  jwt = require('jsonwebtoken')

const bcrypt = require('bcrypt')
const { USER_JWT_KEY } = require('../config')
UserRouter.use(express.json())
UserRouter.post('/signup', async (req, res) => {
        const Zschema = z.object({
                email: z.string().email('please enter valid email'),
                password: z.string().min(4, 'minimum length of 4'),
                Firstname: z.string().min(1, 'atleast 1 letter'),
                Lastname: z.string().min(1, 'atleast 1 letter'),
        })
        try {
                const parsedData = Zschema.safeParse(req.body)
                if (parsedData.success) {
                        try{
                                const hash = await bcrypt.hash(req.body.password , 5)
                                await UserModel.create({
                                        email: req.body.email,
                                        password:hash,
                                        Firstname:req.body.Firstname,
                                        Lastname:req.body.Lastname

                                })
                        }catch(e){
                                return res.status(400).send(e.errmsg)
                        }
                }
                else {
                        return res.status(400).send(parsedData.error)
                }

                res.status(200).json({
                        message: 'Success full sign in'
                })
        }
        catch (e) {
                res.json(e)
        }

})




UserRouter.post('/signin',async (req, res) => {
        const Zschema = z.object({
                email: z.string().email('please enter valid email'),
                password: z.string().min(4, 'minimum length of 4'),
        })
        const Parse = Zschema.safeParse(req.body)
        if(Parse.success){
              const user = await UserModel.findOne({
                email:req.body.email
              })
              if(user){
                const passCheck = bcrypt.compare(req.body.password , user.password)
                if(passCheck){
                const token = jwt.sign({ id:user._id } ,USER_JWT_KEY)
                return res.status(200).json({
                        token
                })}
              }
              else{
                return res.status(400).send('password or name is incorrect')
              }
        }

        
})



UserRouter.get('/purchased', (req, res) => {
        res.json({
                'message': 'purchased'
        })
})

module.exports = {
        UserRouter: UserRouter
}