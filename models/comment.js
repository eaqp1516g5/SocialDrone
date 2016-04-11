var mongoose = require('mongoose');
Schema = mongoose.Schema;

var commentSchema = new Schema({
    username: {type: String},
    text: {type: String},
    like: {type: Number},
    Date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Comment', commentSchema);