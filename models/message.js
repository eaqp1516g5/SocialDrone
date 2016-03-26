var mongoose = require('mongoose');
Schema = mongoose.Schema;

var messageSchema = new Schema({
    username: {type: String},
    text: {type: String},
    like: {type: Number},
    Date: {type: Date, default: Date.now},
    comment: [{
        username: String,
        text: String,
        like: Number,
        date: {type: Date, default: Date.now}
    }]
});

module.exports = mongoose.model('Message', messageSchema);