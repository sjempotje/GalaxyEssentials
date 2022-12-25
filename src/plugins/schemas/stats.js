const mongoose = require('mongoose')

const CreateStats = mongoose.Schema({
    guildID: {
        type: String,
        default: null
    },
    guildName: {
        type: String,
        default: null
    },
    guildIcon: {
        type: String,
        default: null
    },
    guildOwner: {
        type: String,
        default: null
    },
    guildOwnerID: {
        type: String,
        default: null
    },
    guildMembers: {
        type: Number,
        default: null
    },
    guildChannels: {
        type: Number,
        default: null
    },
    guildRoles: {
        type: Number,
        default: null
    },
    guildBoosts: {
        type: Number,
        default: null
    },
    //now the banned members
    guildBannedMembers: {
        type: Number,
        default: null
    },
    //kick members
    guildKickedMembers: {
        type: Number,
        default: null
    }
})

module.exports = mongoose.model('stats', CreateStats)