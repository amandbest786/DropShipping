const mongoose = require("mongoose");
require("dotenv").config();
function checkConncetion() {
  const dbUrl = process.env.MONGODBURL;
  try{
    mongoose.connect(dbUrl,{});
    return "connceted to the database successfully"
  }catch(err){
    console.log("error message",err.message);
    return `error in connnceting ${err.message}`;
  }
}
module.exports = {
    checkConncetion
}
