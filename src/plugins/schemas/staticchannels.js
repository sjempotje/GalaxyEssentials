const mongoose = require('mongoose')

const CreateStaticChannels = mongoose.Schema({
    guildId: {
        type: String,
        default: null
    },
    huntchannel: {
        type: String,
        default: null
    }
})
