const User = require('./../models/userModel/userModel');
const Event = require('./../models/eventModel/eventModel');

let authLogin = (req,res,next)=>{
    let token = req.headers.authorization;
    User.findByToken(token,(error,user)=>{
        if(error) return res.json({ error :error.message });
        if(!user) return res.status(403).json({ error :true, message: 'Erro de sessão. Retornando a Tela de Login', type:'session' });
        req.token = token;
        req.user = user;
        res.setHeader('authorization',req.token)
        next();
        
    })
}

let authPermissionUser = (req,res,next)=>{
    try{
        User.findById(req.params.id,(error,user)=>{
            if(error) return res.json({ error :error.message });
            if(!user) return res.json({ error :true });
            if(user.id != req.user._id) return res.json({ error :true, message: 'Usuário logado não tem permissão para esta ação', type:'permission' });
            next();
        })
    }catch(error){
        console.log(error) 
        return res.json({ error :true, message: error.message });
    }
}

let authPermissionEvent = (req,res,next)=>{
    Event.findById(req.params.id,(error,event)=>{
        if(error) return res.json({ error :error.message });
        if(!event) return res.json({ error :true });
        if(event.user_owner != req.user._id) return res.json({ error :true, message: 'Usuário logado não tem permissão para esta ação', type:'permission' });
        next();
    })
}

module.exports={authLogin, authPermissionUser, authPermissionEvent};