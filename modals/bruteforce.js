const ExpressBrute = require("express-brute");
const MongooseStore = require("express-brute-mongoose");
const BruteForceSchema = require("express-brute-mongoose/dist/schema");
const mongoose = require("mongoose");

// const BruteForceSchema = new mongoose.Schema({
//     "_id": String,
//     "data": {
//       "count": Number,
//       "lastRequest": Date,
//       "firstRequest": Date
//     },
//     "expires": Date
// })

const model = mongoose.model(
  "bruteforce",
  //  BruteForceSchema
  new mongoose.Schema(BruteForceSchema)
);

const store = new MongooseStore(model);
const bruteforce = new ExpressBrute(store);
module.exports = bruteforce ; 