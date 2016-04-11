var mongoose = require('mongoose');
Schema = mongoose.Schema;
var Comment = require('../models/comment.js')
var Comment = mongoose.model('Comment');

var messageSchema = new Schema({
    username: {type: String},
    text: {type: String},
    like: {type: Number},
    Date: {type: Date, default: Date.now},
    comment: [{type : mongoose.Schema.Types.ObjectId, ref:"Comment"}]
});

module.exports = mongoose.model('Message', messageSchema);