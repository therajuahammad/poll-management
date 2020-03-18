const {Schema, model} = require('mongoose')
const valid = require('validator')

const UserSchema = new Schema({
     name: {
          type: String,
          required: true,
          trim: true
     },
     email: {
          type: String,
          required: true,
          minlength: 8,
          maxlength: 50,
          trim: true,
          validate: {
               validator: (v) => {
                    return valid.isEmail(v);
               }
          }
     },
     password: {
          type: String,
          trim: true
     }
})

const User = model('user', UserSchema);

module.exports = User