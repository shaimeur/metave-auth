const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    email : {
        type : String,
        require : true ,
        unique : true
    },
    password : {
        type : String ,
        require : true,
        unique : false
    },
    userName : {
        type : String,
        require : true,
        unique : false
    }

}) ;


module.exports = mongoose.model.Users || mongoose.model("Users",UserSchema);