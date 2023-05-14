const mongoose = require('mongoose');

const CreateCredits = mongoose.Schema({
    userid: {
        type: String,
        default: null
    },
    tokens: {
        type: Number,
        default: 5
    },
    refreshdate: {
        //ofc a date in timestamp
        type: Number,
        default: null
    },
    refreshamount: {
        type: Number,
        default: 5
    }
});

module.exports = mongoose.model('Credits', CreateCredits);
