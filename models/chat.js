var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');


var chatSchema = new Schema({
    users: [{type : mongoose.Schema.Types.ObjectId, ref:"User"}],
    date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);