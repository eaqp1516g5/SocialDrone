/**
 * Created by bernat on 10/03/16.
 */
var mongoose = require('mongoose');

Schema = mongoose.Schema;

var userSchema = new Schema({
    username: {type: String},
    password: {type: String},
    email: {type: String},
    gender:{type: String},
    address:{type: String}
});

module.exports = mongoose.model('User', userSchema);
