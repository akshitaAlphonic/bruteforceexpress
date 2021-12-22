const express = require('express');
const app = express()
const router = express.Router()
const bcryptjs = require('bcryptjs')
const json  = require('jsonwebtoken')
const Register = require("../modals/register");
const ExpressBrute  = require('express-brute');
const bruteforce = require('../modals/bruteForce');

var failCallback = function (req, res, next, nextValidRequestDate) {
req.json({"error" : "You've made too many failed attempts in a short period of time, please try again "}) 
};

var handleStoreError = function (error) {
console.log(error)
    throw new Error({
      message: error.message,
      parent: error.parent
    })
}

// // Start slowing requests after 5 failed attempts to do something for the same user
var userBruteforce = new ExpressBrute(bruteforce, {
	freeRetries: 5,
	minWait: 5*60*1000,// 5 minutes
	maxWait: 60*60*1000,// 1 hour,
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

// // No more than 1000 login attempts per day per IP
var globalBruteforce = new ExpressBrute(bruteforce, {
	freeRetries: 1000,
	attachResetToRequest: false,
	refreshTimeoutOnRequest: false,
	minWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	maxWait: 25*60*60*1000, // 1 day 1 hour (should never reach this wait time)
	lifetime: 24*60*60, // 1 day (seconds not milliseconds)
	failCallback: failCallback,
	handleStoreError: handleStoreError
});

// app.set('trust proxy', 1);
//  // Don't set to "true", it's not secure. Make sure it matches your environment



router.post('/login', 
 globalBruteforce.prevent,   
userBruteforce.getMiddleware({
  key: function(req, res, next) {
    next(req.body.email);
  }
}), 
async(req,res)=>{
    try{
    let body = req.body;
    console.log(body)
    let array = ["email" , "password"]  
    for(let i =0 ; i<array.length ; i++)
    {
        let element = array[i]
        if(!body[element])
        {
            res.status(400).json({message :'Field is missing'})
        }
        let loginEmail = req.body.email ; 
        let loginPassword = req.body.password;
    
        let user = await Register.findOne({email : loginEmail})
        console.log(user)
        if(user.email == loginEmail)
        {
            const isMatch = await bcryptjs.compare(loginPassword , user.password)
            if(isMatch)
            {
                res.status(200).json({messsage :user})
            }
            else {
                res.status(401).json({message :'Invalid login credentials'})
                 }
        }
        else {
            res.status(401).json({message :'Invalid login credentials'})
             }
    }
    }
    catch(e)
    {
        res.status(500).json({message : 'err'})
        console.log(e)
    }
    })
  
module.exports = router ;

