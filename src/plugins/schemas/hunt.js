const mongoose = require('mongoose');

const CreateHunt = mongoose.Schema({
    username: {
        type: String,
        default: null
    },
    uuid: {
        type: String,
        default: null
    },
    discordid: {
        type: String,
        default: null
    },
    permfocus: {
        type: Boolean,
        default: false
    },
    focustime: {
        type: Number,
        default: 0
    },
    status: {
        type: Boolean,
        default: false
    },
    shopper: {
        type: Boolean,
        default: false
    },
});

module.exports = mongoose.model('Hunt', CreateHunt);