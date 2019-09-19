//Developer Schema
const mongoose = require('mongoose');
let developerSchema = mongoose.Schema({
    _id: Number,
    developername: {
        firstName: {
            type: String,
            required: true
        },

        lastName: String
    },
    level: {
        type: String,
        required: true,
         validate: {
             validator: function (levelValue) {
                 if(levelValue == "Beginner" || levelValue == "Expert"){
                     return levelValue;
                 }},
             message: 'Level should be Beginner or Expert'
        },
        uppercase: true
    },
    address: {
        state: String,
        suburb: String,
        street: String,
        unit: String
    }
});
module.exports = mongoose.model('Developer', developerSchema);