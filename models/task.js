//Task Schema
const mongoose = require('mongoose');
let taskSchema = mongoose.Schema({
    _id: Number,
    name: String,
    assignto: {
        type: Number,
        ref: 'Developer'
    },
    due: Date,
    status: String,
    description: String
});
module.exports = mongoose.model('Task', taskSchema);