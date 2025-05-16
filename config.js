require('dotenv').config()
const USER_JWT_KEY = process.env.USER_JWT_KEY
const ADMIN_JWT_KEY = process.env.ADMIN_JWT_KEY


module.exports ={
        USER_JWT_KEY,
        ADMIN_JWT_KEY
}