var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');

var eventSchema = new Schema({
    name: {type: String},
    description: {type: String},
    lat: {type: Number},
    long: {type: Number},
    Date: {type: Date},
    hour: {type: String},
    day: {type: String},
    loc: {type: [Number], index: '2dsphere'},
    createdby: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    go: [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
});

module.exports = mongoose.model('event', eventSchema);
