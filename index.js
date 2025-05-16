const express = require('express')
const { UserRouter } = require('./routes/user')
const { CourseRouter } = require('./routes/courses')
const { adminRouter } = require('./routes/admin')
const app = express()
app.use('/api/v1/user', UserRouter)
app.use('/api/v1/courses', CourseRouter)
app.use('/api/v1/admin', adminRouter)
app.use(express.json())
const mongoose = require('mongoose')



require('dotenv').config()

async function main() {
        await mongoose.connect(process.env.DB_URL)
        app.listen(3000)
}
main()
