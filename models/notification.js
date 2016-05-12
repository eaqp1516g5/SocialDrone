var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');

var notificationSchema = new Schema({
    userid: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    actionuserid: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    text: {type: String},
    type: {type: Number}
});

//types
// 0 = coment message
// 1 = some user follow you
module.exports = mongoose.model('notification', notificationSchema);
