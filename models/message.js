var mongoose = require('mongoose');
Schema = mongoose.Schema;
var Comment = require('../models/comment.js')
var Comment = mongoose.model('Comment');
var user = require('../models/user.js');
var user = mongoose.model('User');

var messageSchema = new Schema({
    username: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    text: {type: String},
    like: {type: Number},
    Date: {type: Date, default: Date.now},
    comment: [{type : mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});

module.exports = mongoose.model('Message', messageSchema);