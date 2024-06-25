// models/Properties.js (MongoDB model)

const mongoose = require('mongoose');

const PropertiesSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
        unique: true
    },

});

module.exports = mongoose.model('Properties', PropertiesSchema);