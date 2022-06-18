const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const confiq = require('../../config/config').get(process.env.NODE_ENV);
const salt = 10;
const Event = require('../../models/eventModel/eventModel');

const userSchema = new mongoose.Schema({
    username: {
        required: true,
        type: String
    },
    password: {
        required: true,
        type: String,
        minlength:8
    },
    first_name: {
        required: true,
        type: String,
        maxlength: 100
    },
    last_name: {
        required: true,
        type: String,
        maxlength: 100
    },
    birth_date: {
        required: true,
        type: Date
    },
    events: [{
            required: false,
            type: mongoose.Schema.Types.ObjectId,
            ref:'Event',
    }],
    token:{
        type: String
    }
})

userSchema.pre('save',function(next){
    var user=this
    
    if(user.isModified('password')){
        bcrypt.genSalt(salt,function(error,salt){
            if(error)return next(error);

            bcrypt.hash(user.password,salt,function(error,hash){
                if(error) return next(error);
                user.password=hash;
                next();
            })

        })
    }
    else{
        next();
    }
});

userSchema.pre('deleteOne', { document: true }, async function(next) {
    var user=this
    for(event_id of user.events){
        const eventDeleted = await Event.findOne({_id:event_id})
        await eventDeleted.deleteOne()
    }
    next();
})

userSchema.methods.comparepassword = function(password,cb){
    bcrypt.compare(password,this.password,function(error,isMatch){
        if(error) return cb(next);
        cb(null,isMatch);
    });
}
,
userSchema.methods.generateToken=function(cb){
    var user =this;
    var token = jwt.sign(user._id.toHexString(),confiq.SECRET);

    user.token = token;
    user.save(function(error,user){
        if(error) return cb(error);
        cb(null,user);
    })
}

userSchema.statics.findByToken = function(token,cb){
    var user=this;

    jwt.verify(token,confiq.SECRET,function(error,decode){
        user.findOne({"_id": decode, "token":token},function(error,user){
            if(error) return cb(error);
            cb(null,user);
        })
    })
};

userSchema.methods.deleteToken=function(token,cb){
    var user=this;

    user.updateOne({$unset : {token :1}},function(error,user){
        if(error) return cb(error);
        cb(null,user);
    })
}

module.exports = mongoose.model('User', userSchema)