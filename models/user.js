/**
 * Created by bernat on 10/03/16.
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
    imageUrl: {type: String, default:'images/user.png'},

    createdAt: {type: Date, default: Date.now},

    admin:{
        type: Boolean
    },
    id_facebook:{
        type: String
    },
    mydrones: [
        {
          type : mongoose.Schema.Types.ObjectId, ref:"Drone"
        }
      ]
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
