const mongoose = require('mongoose');

const CreateMatches = mongoose.Schema({
    guild: {
        type: String,
        required: true,
        unique: true,
    },
    //id of the channel where the matches are posted
    channel: {
        type: String,
        required: true,
    },
    //id of the match (e.g. 1)
    match_id: {
        type: Number,
        required: true,
    },
    //when did the match start
    match_start: {
        type: Date,
        required: true,
    },
    //when did the match end
    match_end: {
        type: Date,
        required: true,
    },
    //the players in the match
    players: {
        type: Array,
        required: true,
    }
});

module.exports = mongoose.model('matches', CreateMatches);