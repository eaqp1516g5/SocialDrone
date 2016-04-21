/**
 * Created by bernat on 21/04/16.
 */

var mongoose = require('mongoose');
Schema = mongoose.Schema;
var user = require('../models/user.js');
var user = mongoose.model('User');

var tokenSchema = new Schema({

    token: {
        type: String
    },
    userid:{type : mongoose.Schema.Types.ObjectId, ref:"User"
    }
    
    
});

module.exports = mongoose.model('AuthToken', tokenSchema);