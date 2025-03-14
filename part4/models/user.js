const { Schema, model } = require('mongoose');

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true, // esto asegura la unicidad de username
        minlength: 3
    },
    name: String,
    passwordHash: {
      type: String,
      required: true,
      minlength: 3  
    },
    notes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Note'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        // el passwordHash no debe mostrarse
        delete returnedObject.passwordHash
    }
})

const User = model('User', userSchema);

module.exports = User;