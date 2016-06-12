/**
 * Created by kenshin on 10/06/16.
 */
var user = require('../models/drone.js');
var user = mongoose.model('Drone');
var bcrypt = require('bcrypt-nodejs');


Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {
        type: String
    },
    drone: {
        type: Drone
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
