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
        type: Number //IN KG
    },
    battery: {
        type: Number //in mAH
    },
    description: {
        type: String
    },
    type: {
        type: String,
        enum: ['homemade', 'commercial']
    },
    imageUrl: {
        type: String
    },
    ratio: {
        type: Number
    },
    rated: [
        {
          type : mongoose.Schema.Types.ObjectId, ref:"User"
        }
      ],
    releaseDate: {
        type: Date, default: Date.now
    }

});

module.exports = mongoose.model('Drone', droneSchema);
