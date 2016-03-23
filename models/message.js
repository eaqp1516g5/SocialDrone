var mongoose = require('mongoose');

Schema = mongoose.Schema;

var messageSchema = new Schema({
    username: {type: String},
    text: {type: String}
});

module.exports = mongoose.model('Message', messageSchema);
