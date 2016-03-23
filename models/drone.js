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
    weight: {
        type: String
    },
    battery: {
        type: String
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['homemade', 'comercial']
    },
    imageUrl: {
        type: String
    },
    releaseDate: {
        type: Date, default: Date.now
    }

});

module.exports = mongoose.model('Drone', droneSchema);
