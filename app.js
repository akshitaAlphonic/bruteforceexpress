require('dotenv').config()
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const loginRouter = require('./routes/login')
const registerRouter = require('./routes/register')
mongoose.connect('mongodb://localhost:27017/test');

const port = process.env.PORT
app.use(express.json())
app.use(registerRouter)
app.use(loginRouter)

app.get('/',(req,res)=>{
    res.json({message : "home page"})
})


app.listen(port , ()=>{
console.log(`App listening to the port ${port}`)
})