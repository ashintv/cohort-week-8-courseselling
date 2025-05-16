
const { Router } = require('express')
const adminRouter = Router()
const { AdminModel } = require('../db')
const { CoursesModel } = require('../db')
const express = require('express')
const { z } = require('zod')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { ADMIN_JWT_KEY } = require('../config')
const { AdminAuthMiddleware } = require('../middlewares/admin')
adminRouter.use(express.json())


adminRouter.post('/signup', async (req, res) => {
        const Zschema = z.object({
                email: z.string().email('please enter valid email'),
                password: z.string().min(4, 'minimum length of 4'),
                Firstname: z.string().min(1, 'atleast 1 letter'),
                Lastname: z.string().min(1, 'atleast 1 letter'),
        })
        try {
                const parsedData = Zschema.safeParse(req.body)
                if (parsedData.success) {
                        try {
                                const hash = await bcrypt.hash(req.body.password, 5)
                                await AdminModel.create({
                                        email: req.body.email,
                                        password: hash,
                                        Firstname: req.body.Firstname,
                                        Lastname: req.body.Lastname

                                })
                        } catch (e) {
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



adminRouter.post('/signin', async (req, res) => {
        console.log('req')
        const Zschema = z.object({
                email: z.string().email('please enter valid email'),
                password: z.string().min(4, 'minimum length of 4'),
        })
        const Parse = Zschema.safeParse(req.body)
        if (Parse.success) {
                const user = await AdminModel.findOne({
                        email: req.body.email
                })
                if (user) {
                        const passCheck = bcrypt.compare(req.body.password, user.password)
                        if (passCheck) {
                                const token = jwt.sign({ id: user._id }, ADMIN_JWT_KEY)
                                return res.status(200).json({
                                        token
                                })
                        }
                }
                else {
                        return res.status(400).send('password or name is incorrect')
                }
        }


})



adminRouter.post('/course', AdminAuthMiddleware, async (req, res) => {
        const Zod = z.object({
                title: z.string().min(5, 'Atleast 5 char'),
                description: z.string().min(5, 'Atleast 5 char'),
                imageURL: z.string().min(5, 'Atleast 5 char'),
                price: z.number(),
        })
        const Parse = Zod.safeParse(req.body)
        if (Parse.success) {
                try {
                        const course = await CoursesModel.create(req.body)
                        res.json({
                                title: course.title,
                                Id: course._id
                        })
                } catch (e) {
                        return res.status(400).json(e)
                }



        } else {
                return res.status(400).json(Parse.error)
        }
})




adminRouter.put('/course', AdminAuthMiddleware, async (req, res) => {
        const Zod = z.object({
                title: z.string().min(5, 'Atleast 5 char'),
                description: z.string().min(5, 'Atleast 5 char'),
                imageURL: z.string().min(5, 'Atleast 5 char'),
                price: z.number(),
        })
        const Parse = Zod.safeParse(req.body)
        if (Parse.success) {
                try {
                        const update = await CoursesModel.updateOne({ _id: req.body.courseId, creator: req.body.creator }, req.body)
                        if (update.matchedCount === 0) { return res.json({ message: 'update failed item not found' }) }
                        res.json({ message: 'updated' })
                } catch (e) {
                        return res.status(400).json(e)
                }
        } else {
                return res.status(400).json(Parse.error)
        }

})

adminRouter.get('/course/bulk', AdminAuthMiddleware, async (req, res) => {
        try {
                const course = await CoursesModel.find({
                        creator: req.body.creator
                })
                res.json(course)
        }
        catch (e) {
                res.json(e)
        }
})
module.exports = {
        adminRouter: adminRouter
}