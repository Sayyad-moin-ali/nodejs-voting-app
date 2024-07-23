const mongoose = require('mongoose')
// const bcrypt = require('bcrypt')

const candidateschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    votes: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "user"
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }

        }
    ],
    voteCount: {
        type: Number,
        default: 0
    }

})

const candidate = mongoose.model('candidate', candidateschema);
module.exports = candidate;
