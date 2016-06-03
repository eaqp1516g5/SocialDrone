var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');

var commentSchema = new Schema({
    username: {type: String},
    id: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    text: {type: String},
    like: {type: Number},
    imageUrl:{type:String},
    Date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);