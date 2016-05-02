/**
 * Created by bernat on 2/05/16.
 */
var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');

var followSchema = new Schema({
    userid: {type : mongoose.Schema.Types.ObjectId, ref:"User"},
    following: [{type : mongoose.Schema.Types.ObjectId, ref:"User"}],
    follower: [{type : mongoose.Schema.Types.ObjectId, ref:"User"}]
});

module.exports = mongoose.model('Follow', followSchema);