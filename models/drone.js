/**
 * Created by Kenshin on 21/03/16.
 */
var mongoose = require('mongoose');
//var bcrypt = require('bcrypt-nodejs');


Schema = mongoose.Schema;

var droneSchema = new Schema({

    vendor: {
        type: String
    },
    model: {
        type: String
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    }
});

module.exports = mongoose.model('Drone', droneSchema);
