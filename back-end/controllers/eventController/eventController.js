const Event = require('../../models/eventModel/eventModel');

exports.createEvent = function (req, res) {
    const newEvent = new Event({
        description:   req.body.description,
        event_begin:   req.body.event_begin,
        event_end: req.body.event_end,
        user_owner:  req.user._id,
        guests: req.body.guests,
    })

        newEvent.save().then( dataEvent =>{
            const User = require('../../models/userModel/userModel');
            User.findOne({_id:req.user._id}, function (err,dataUser) {
                if(!dataUser) return
                dataUser.events.push(dataEvent._id)
                dataUser.save()
            })  
        })
        res.status(200).send('Evento '+ newEvent.description +' criado!')

}

exports.findAllEvents = async function (res) {
    const events = await Event.find();
    res.json(events)
}

exports.findEvent = async function (req, res) {
    const event = await Event.findById(req.params.id);
    res.json(event)
}

exports.updateEvent = async function (req, res) {
    const id = req.params.id;
    const updatedEvent = req.body;
    const options = { new: true };
    
    const result = await Event.findByIdAndUpdate(id, {
        description: updatedEvent.description, 
        event_begin: updatedEvent.event_begin,
        event_end: updatedEvent.event_end,
        guests: updatedEvent.guests
    }, options)

    res.send(result)
}

exports.deleteEvent = async function (req, res) {
    const id = req.params.id;

    Event.find({ _id: id }).then(async dataEvent => {
        try{
            const User = require('../../models/userModel/userModel');
            if(!dataEvent[0].user_owner) throw 'Erro ao excluir evento.'
            User.findById(dataEvent[0].user_owner).then(dataUser => {
                dataUser.events.pull(id)
                dataUser.save()
            })


            const eventDeleted = await Event.findByIdAndDelete(id)
            res.send('Evento ' + eventDeleted.description + ' foi deletado com sucesso..')
            return
        }catch (error) {
            return res.json({ error :error.message });
        }
    })
}

exports.updateEventGuests = async function (req, res) {
    const id = req.params.id;
    const updateEventGuests = req.body.guests;

    const result = Event.findByIdAndUpdate(id).then(dataEvent => {
        for(guest of updateEventGuests){
            dataEvent.guests.push(guest)
        }
        dataEvent.save()
    })
    res.send(result)
}