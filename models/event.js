var mongoose = require('mongoose');
Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: {type: String},
    description: {type: String},
    lat: {type: Number},
    long: {type: Number},
    Date: {type: Date},
    hour: {type: String},
    day: {type: String}
});

module.exports = mongoose.model('event', eventSchema);
