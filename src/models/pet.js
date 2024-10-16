// models/pets.js
const mongoose = require("mongoose");

const petSchema = mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    type: { 
        type: String, 
        required: true 
    },
    raza: { 
        type: String 
    },
    age: { 
        type: Number, required: true, min: 0 
    },
    photo: { 
        type: String 
    },
    owners: [{  // Relación muchos a muchos con usuarios
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }]  
});

module.exports = mongoose.model('Pets', petSchema);
