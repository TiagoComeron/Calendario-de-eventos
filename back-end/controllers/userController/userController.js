const User = require('../../models/userModel/userModel');

exports.findAllUsers = async function (res) {
    const users = await User.find();
    res.json(users)
}

exports.findUser = async function (req, res) {
    const user = await User.findById(req.params.id);
    res.json(user)
}

exports.updateUser = async function (req, res) {
    const id = req.params.id;
    const updatedUser = req.body;
    const options = { new: true };

    const result = await User.findByIdAndUpdate(id, {
        username: updatedUser.username, 
        password: updatedUser.password, //deve ser feito um método específico futuramente
        first_name: updatedUser.first_name,
        birth_date: updatedUser.birth_date,
        events: updatedUser.events // Verificar necessidade de existencia dessa linha
    }, options )

    res.send(result)
}

exports.deleteUser = async function (req, res) {
    const id = req.user._id;
    try{
        const userDeleted = await User.findOne({_id:id})
        if(!userDeleted)
            res.send('Usuário já deletado..')
        else{
            await userDeleted.deleteOne()
            res.send('Usuário '+ userDeleted.username +' foi deletado com sucesso..')
        }
    }catch(error){
        console.log(error)
    }
}

exports.registerUser = function (req, res) {
    const newuser = new User({
        username:   req.body.username,
        password:   req.body.password,
        first_name: req.body.first_name,
        last_name:  req.body.last_name,
        birth_date: req.body.birth_date,
        events:     req.body.events
    })
    
    User.findOne({username:newuser.username},function(error,user){
        if(user) return res.status(400).json({ auth : false, message :"Este username já existe!"});

        newuser.save((error,doc)=>{
            if(error) {
                console.log(error);
                return res.status(400).json({ success : false});
            }

            res.status(200).json({
                succes:true,
                user : doc
            });
        });
    });
}

exports.loginUser = function (req, res){
    let token=req.cookies.auth;
    User.findByToken(token,(err,user)=>{
        if(err) return  res(err);
        if(user) return res.status(400).json({
            error :true,
            message:"You are already logged in"
        });
    
        else{
            User.findOne({'username':req.body.username},function(err,user){
                if(!user) return res.json({isAuth : false, message : ' Auth failed, username not found'});
        
                user.comparepassword(req.body.password,(err,isMatch)=>{
                    if(!isMatch) return res.json({ isAuth : false ,message : "password doesn't match"});
        
                user.generateToken((err,user)=>{
                    if(err) return res.status(400).send(err);
                    res.cookie('auth',user.token).json({
                        isAuth : true,
                        id : user._id
                        ,username : user.username
                    });
                });    
            });
          });
        }
    });
}

exports.logoutUser = function (req, res){
    req.user.deleteToken(req.token,(error,user)=>{
        if(error) return res.status(400).send(error);
        res.sendStatus(200);
    });
}
//terminar função
exports.changePassword = function(req, res){
    return
}