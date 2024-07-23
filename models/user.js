const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    address: {
        required: true,
        type: String,
    },
    aadharCardnumber: {
        required: true,
        type: String,
        unique: true,
    },
    password: {
        required: true,
        type: String,
    },
    role: {
        type: String,
        enum: ["voter", "admin"],
        default: "voter",
    },
    isVoted:{
     type:Boolean,
     default:false,
    }

})


userschema.pre("save", async function (next) {
    const person = this;
    if (!person.isModified('password')) return next();

    try {
        //hash password generate
        const salt = await bcrypt.genSalt(10);

        //hash password
        const hashedpassword = await bcrypt.hash(person.password, salt)

        person.password = hashedpassword


    } catch (err) {
        return next(err)
    }
})

userschema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;

    } catch (err) {
        throw err;
    }
}

const user = mongoose.model('user', userschema);
module.exports = user;
