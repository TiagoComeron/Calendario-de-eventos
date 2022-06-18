const express = require('express');

const UserController = require('../controllers/userController/userController');
const EventController = require('../controllers/eventController/eventController');

const {authLogin,authPermissionUser,authPermissionEvent} = require('../middlewares/auth');

const router = express.Router()

router.get('/user/findAll', async (req, res) => {
    try{
        UserController.findAllUsers(res)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/user/find/:id', async (req, res) => {
    try{
        UserController.findUser(req, res)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch('/user/update/:id',authLogin,authPermissionUser, async (req, res) => {
    try {
        UserController.updateUser(req, res)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/user/delete/:id',authLogin,authPermissionUser, async (req, res) => {
    try {
        UserController.deleteUser(req, res)
    }
    catch (error) {
        res.status(400).json({ message: error })
    }
})

// Event Routes -------------------------------------------------------------
router.post('/event/create',authLogin, async (req, res) => {
    try {
        EventController.createEvent(req, res)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

router.get('/event/findAll', async (req, res) => {
    try{
        EventController.findAllEvents(res)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.get('/event/find/:id', async (req, res) => {
    try{
        EventController.findEvent(req, res)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.patch('/event/update/:id',authLogin,authPermissionEvent, async (req, res) => {
    try {
        EventController.updateEvent(req, res)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/event/delete/:id',authLogin,authPermissionEvent, async (req, res) => {
    try {
        EventController.deleteEvent(req, res)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/event/updateGuests/:id',authLogin,authPermissionEvent, async (req, res) => {
    try {
        EventController.updateEventGuests(req, res)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

// Login Routes -------------------------------------------------------------
router.post('/register',function(req,res){
    try{
        UserController.registerUser(req, res)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
    
 })

router.post('/login', function(req,res){
    try{
        UserController.loginUser(req, res)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

router.get('/user/profile',authLogin,function(req,res){
        res.json({
            isAuth: true,
            id: req.user._id,
            username: req.user.username,
            name: req.user.first_name +" "+ req.user.last_name
            
        })
});

router.get('/logout',authLogin,function(req,res){
    try{
        UserController.logoutUser(req, res)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }

}); 

router.post('/user/changePassword/:id',authLogin,authPermissionUser, function(req,res){
    try{
        UserController.changePasswordUser(req, res)
    }
    catch(error){
        res.status(400).json({message: error.message})
    }
})

module.exports = router;