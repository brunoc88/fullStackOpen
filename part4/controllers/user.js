const usersRouter = require('express').Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');

usersRouter.post('/', async (req, res, next) => {
    const { username, name, password } = req.body;

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
    const user = new User({
        username,
        name,
        passwordHash,
    })

    const savedUser = await user.save()

    return res.status(201).json(savedUser)
})

usersRouter.get('/', async(req,res,next) =>{
    const users = await User.find({});
    return res.status(200).json(users);
})
module.exports = usersRouter;
