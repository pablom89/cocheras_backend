const { Schema, model } = require('mongoose');

/* const user = {

    "correo": cmuzio375@gmail.com,
    "password" : *******
}

*/

const userSchema = Schema({
  
    nombre:{
        type: String,
        required: true,
        unique: true
    },

    correo: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true,   
    },

    estado:{
        type: Boolean,
        default: true
    }
});

userSchema.methods.toJSON = function(){
  const { __v, password, _id, ...user } = this.toObject();
  user.uid = _id
  return user;
}

module.exports = model( 'User', userSchema )