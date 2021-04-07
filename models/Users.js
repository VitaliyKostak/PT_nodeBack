const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const User = new Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    friendsList: [
        {
            type: Schema.Types.ObjectId,
            default: []
        }
    ],
    friendsInList: [
        {
            type: Schema.Types.ObjectId,
            default: []
        }
    ],
    friendsOutList: [
        {
            type: Schema.Types.ObjectId,
            default: []
        }
    ]
});

module.exports = mongoose.model('Users', User);