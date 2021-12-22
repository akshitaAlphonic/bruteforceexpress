const mongoose = require('mongoose')
require("dotenv").config()

const schema = new mongoose.Schema(({
    name  :{type : String},
    email : {type : String},
    password : {type : String},
    cpassword : {type : String},
    contactNo : {type : Number},
    token : {type : String}
}))


const model = mongoose.model("register" ,schema )
module.exports = model