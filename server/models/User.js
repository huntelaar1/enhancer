const { Schema, model} = require('mongoose');
const bcrypt = require('bcrypt');

// line for importing schema from Art.js for saved art/gallery
const artSchema = require('./Art');

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: true,
        },
        gallery: [artSchema]
    },
        // set gallery to be an array that adheres to artSchema
        // , },
    {
        toJSON: {
            virtuals: true,
        },
    }
);

userSchema.pre('save', async function (next) {
    if (this.isNew || this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

userSchema.methods.isCorrectPassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = model('User', userSchema);

module.exports = User;