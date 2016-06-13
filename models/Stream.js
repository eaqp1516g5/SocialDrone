/**
 * Created by kenshin on 10/06/16.
 *
 */
var mongoose = require('mongoose');
var drone = require('../models/drone.js');
var drone = mongoose.model('Drone');
var bcrypt = require('bcrypt-nodejs');
var user = require('../models/user.js');
var user = mongoose.model('User');

Schema = mongoose.Schema;

var streamSchema = new Schema({

    username: {
        type: String
    },
    drone: {
        type : mongoose.Schema.Types.ObjectId, ref:"Drone"
    },
    streamIP: {
        type: String
    },
    pilots: [
        {
            type : mongoose.Schema.Types.ObjectId, ref:"User"
        }
    ],
});
module.exports = mongoose.model('Stream', streamSchema);
