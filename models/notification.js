var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');
var notification = require('../models/notification.js');


var notificationSchema = new Schema({
    userid: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    actionuserid: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    text: {type: String},
    type: {type: Number},
    date: {type: Date, default: Date.now},
    idnotification: {type: String}
});

//types
// 0 = coment message
// 1 = some user follow you
// 2 = some user like your message
// 3 = some user like your comment
// 4 = this user creates a new event
module.exports = mongoose.model('notification', notificationSchema);
