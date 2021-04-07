const { Schema, model } = require('mongoose');


const Publication = new Schema({
    text: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        required: true,
    },
    comments: [
        {
            text: {
                type: String,
                required: true
            },
            authorId: {
                type: Schema.Types.ObjectId,
                required: true,
                ref: 'Users'
            },
            authorName: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                default: Date.now
            }
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = model('Publications', Publication);