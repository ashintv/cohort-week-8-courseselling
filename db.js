
const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId


const UserSchema = Schema({
        email : {type : String, unique:true},
        password : String,
        Firstname : String,
        Lastname : String
})

const AdminSchema = Schema({
        email : {type : String, unique:true},
        password : String,
        Firstname : String,
        Lastname : String
})


const CourseSchema = Schema({
        title: String,
        description: String,
        imageURL : String,
        price : Number ,
        creator: ObjectId

})

const PurchaseSchema = Schema({
        userId: ObjectId,
        courseId: ObjectId
})


const UserModel = mongoose.model('user' , UserSchema)
const AdminModel = mongoose.model('admin' , AdminSchema)
const CoursesModel = mongoose.model('courses' , CourseSchema)
const PurchaseModel = mongoose.model('purchases' , PurchaseSchema)


module.exports={
        UserModel,
        AdminModel,
        CoursesModel,
        PurchaseModel
}