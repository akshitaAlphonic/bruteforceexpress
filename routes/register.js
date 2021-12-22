const express = require("express");
const router = express.Router();
const Register = require("../modals/register");
const ExpressBrute  = require('express-brute');
const bruteforce = require('../modals/bruteForce');


router.post("/register", async (req, res) => {
  try {
    let body = req.body;
    let array = ["name", "email", "password", "cpassword", "contactNo"];
    for (let i = 0; i < array.length; i++) {
      let element = array[i];
      if (!body[element]) {
        res.status(400).json({ message: "field is missing" });
      }
    }
    let newUser = new Register();
    password = body.password;
    cpassword = body.cpassword;

    if(password === cpassword)
    {
      newUser.name = body.name;
      newUser.email = body.email;
      newUser.contactNo = body.contactNo;
      newUser.password =password;
      newUser.cpassword =cpassword;
    }

    let doc = await newUser.save();
    console.log(doc);
    if (!doc) {
      res.status(400).json({ message: "User not Registered" });
    } else {
      res.status(200).json({ message: "ok" });
    }
  } catch (e) {
    res.status(500).json({ message: "Server error" });
    console.log(e);
  }
});

router.get("/get", async (req, res) => {
  try {
let doc = await Register.find()
console.log(doc)
if (!doc) {
    res.status(400).json({ message: "User not found" });
  } else {
    res.status(200).json({ message: "ok" });
  }
  } 
  catch(e) {
    res.status(500).json({ message: "Server error" });
    console.log(e);
  }
});



// router.post(
//   "/auth",
//   bruteforce.prevent, // error 403 if we hit this route too often
//   function(req, res, next) {
//     res.send("Success!");
//   }
// );


var failCallback = function (req, res, next, nextValidRequestDate) {
	req.flash('error', "You've made too many failed attempts in a short period of time, please try again ");
	res.redirect('/login'); 
};

var handleStoreError = function (error) {
console.log(error)
	throw {
		message: error.message,
		parent: error.parent
	};
}

// // Start slowing requests after 5 failed attempts to do something for the same user

var userBruteforce = new ExpressBrute(bruteforce, {
	freeRetries: 5,
	minWait: 5*60*1000, // 5 minutes
	maxWait: 60*60*1000, // 1 hour,
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

// // app.set('trust proxy', 1);
// //  // Don't set to "true", it's not secure. Make sure it matches your environment

router.post(
  "/signup",
  globalBruteforce.prevent,
  userBruteforce.getMiddleware({
    key: function(req, res, next) {
      // prevent too many attempts for the same username
      next(req.body.username);
    }
  }),
  async (req, res, next) => {
    //check if the email is exited
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(400).send("Email or password incorrect!");
    }

    req.brute.reset(function() {
      res.redirect("/"); // logged in, send them to the home page
    });
    res.status(200).json({
      message: {  
        username: req.body.username,
        email: req.body.email,
        pass: req.body.password
      }
    });
  }


)



module.exports = router 
