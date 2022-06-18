const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    description: {
        required: true,
        type: String
    },
    event_begin: {
        required: true,
        type: Date
    },
    event_end: {
        required: true,
        type: Date
    },
    user_owner: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    guests: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'User'
        }
    ]
})

module.exports = mongoose.model('Event', eventSchema)