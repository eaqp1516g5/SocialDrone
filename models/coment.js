var mongoose = require('mongoose');

Schema = mongoose.Schema;

var comentSchema = new Schema({
    username: {type: String},
    text: {type: String},
    like: {type: Number}
});

module.exports = mongoose.model('coment', messageSchema);
