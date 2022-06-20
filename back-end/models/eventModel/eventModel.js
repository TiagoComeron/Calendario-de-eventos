const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String,
        max: 15
    },
    description: {
        required: true,
        type: String,
        min: 8,
        max: 255
    },
    event_begin: {
        required: true,
        type: Date
    },
    event_end: {
        required: false,
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