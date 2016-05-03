var mongoose = require('mongoose');
Schema = mongoose.Schema;

var notificationSchema = new Schema({
    userid: {type: String},
    name: {type: String},
    type: {type: Number},
    long: {type: Number},
    Date: {type: Date},
    hour: {type: String},
    day: {type: String}
});

module.exports = mongoose.model('notification', notificationSchema);
