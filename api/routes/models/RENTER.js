const mongoose = require('mongoose');

const renterSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    room_ID: {type: Number, required: true},
    name: {type: String, required: true}, 
    address: {type: String, required: true},
    contact_no: {type: String, required: true},
    email: {type: String, required: true}, 
    username: {type: String, required: true}, 
    password: {type: String, required: true}


}, { collection: 'RENTERS' });

module.exports = mongoose.model('Renter', renterSchema);