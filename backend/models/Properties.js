// models/Properties.js (MongoDB model)

const mongoose = require('mongoose');

const propertiesSchema = new mongoose.Schema({
    propertyid: {
        type: Number,
        required: true,
        unique: true
    },
    seller: {
        type: String,
        required: true
    },
    buyer: {
        type: String,
        required: true
    },
    approval: {
        type: Boolean,
        required: true
    },
    isListed: {
        type: Boolean,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    },
    deposit: {
        type: Number,
        required: true
    },
    fundStatus: {
        type: Number,
        required: true
    }
});
module.exports = mongoose.model('Properties', propertiesSchema);