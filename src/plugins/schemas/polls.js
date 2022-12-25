const mongoose = require('mongoose')

const CreatePolls = mongoose.Schema({
    guildID: {
        type: String,
        required: true,
        unique: true
    },
    channelID: {
        type: String,
        required: true,
        unique: true
    },
    question: {
        type: String,
        required: true,
        unique: true
    },
    options: {
        type: Array,
        required: true,
        unique: true
    },
    votes: {
        type: Array,
        required: true,
        unique: true
    },
    voters: {
        type: Array,
        required: true,
        unique: true
    },
    //time
    time: {
        type: Number,
        required: true,
        unique: true
    },
    //end
    isEnded: {
        type: Boolean,
        default: false
    },
    //end
    endedReason: {
        type: String,
        default: null
    },
    endedTime: {
        type: Number,
        default: null
    }
})



module.exports = mongoose.model('Polls', CreatePolls)
        