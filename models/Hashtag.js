var mongoose = require('mongoose');
Schema = mongoose.Schema;


var hashtagSchema = new Schema({
    hash: {type :String},
    text: {type: String,"default":[]}

});

module.exports = mongoose.model('Hashtag', hashtagSchema);