/**
 * Created by Admin on 27/05/2016.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');
var chat = require('../models/chat.js');
var chat = mongoose.model('Chat');

var chatMessageSchema = new Schema({
    user: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    message: {type: String},
    date: {type: Date, default: Date.now},
    chatid: {type : mongoose.Schema.Types.ObjectId, ref:"Chat"}
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);