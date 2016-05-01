var mongoose = require('mongoose');
Schema = mongoose.Schema;

var eventSchema = new Schema({
    name: {type: String},
    description: {type: String},
    lat: {type: String},
    long: {type: String},
    Date: {type: Date},
    hour: {type: String},
    day: {type: String}
});

module.exports = mongoose.model('event', eventSchema);
