/**
 * Created by Admin on 28/05/2016.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');
var user = require('../models/chat.js');
var user = mongoose.model('Chat');

var seenSchema = new Schema({
    user: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    chat: {type : mongoose.Schema.Types.ObjectId, ref:"Chat"},
    visto: {type: Boolean, default: false}
});

module.exports = mongoose.model('Seen', seenSchema);