const mongoose = require('mongoose');

const placeschema = mongoose.Schema({
 nickname: String,
 name: String,
 latitude: Number,
 longitude: Number,
});

const Place = mongoose.model('places', placeschema);

module.exports = Place;