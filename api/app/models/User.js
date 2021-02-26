const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["Admin","User"],
        required:true
    }
});

module.exports = mongoose.model("Users" , UserSchema);