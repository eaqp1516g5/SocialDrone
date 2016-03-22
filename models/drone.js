/**
 * Created by Kensin on 21/03/16.
 */
var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');


Schema = mongoose.Schema;

var userSchema = new Schema({

    username: {
        type: String
    },
    name: {
        type: String
    },
    lastname: {
        type: String
    },
    password: {
        type: String
    },
    mail: {
        type: String
    },
    role: {
        type: String,
        enum: ['admin', 'registered']
    },
    imageUrl: {type: String},
    createdAt: {type: Date, default: Date.now}

});



//Generate a hash
userSchema.methods.generateHash = function (password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Check if password is valid
userSchema.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.local.password);
};



module.exports = mongoose.model('User', userSchema);
