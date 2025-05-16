
const { Router } = require('express')
const express = require('express')
const { CoursesModel, PurchaseModel } = require('../db')
const { UserAuthMiddleware } = require('../middlewares/user')
const CourseRouter = Router()


CourseRouter.use(express.json())
CourseRouter.get('/preview',async (req,res)=>{
        const courses =await CoursesModel.find({})
        res.json(courses)
})

CourseRouter.post('/purchase',UserAuthMiddleware ,async (req,res)=>{
        const purchase =await PurchaseModel.create({
                userId: req.body.id,
                courseId:req.body.courseId
        })
        res.json({
                'message' :'purchase'
        })
})
CourseRouter.get('/mycourses' , UserAuthMiddleware , async (req , res)=>{
        const courses = await PurchaseModel.find({
                userId : req.body.id
        })

        const coursedata = {data:[]}
        for (i in courses){
                coursedata.data.push({
                        title:await CoursesModel.find({_id:courses[i].courseId})
                })
        }
        res.json(coursedata)
})


module.exports = {
        CourseRouter:CourseRouter
}

