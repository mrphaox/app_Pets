const mongoose = require("mongoose");

const LoginSchema = new mongoose.Schema({
    nombre:{
        type: String,
        require: true
    },
    contraseña:{
        type:string,
        require:true 
    }
});

const collection = new mongoose.model("users",LoginSchema);

module.exports = collection;