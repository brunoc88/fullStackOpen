const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../utils/config')

loginRouter.post('/', async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return res.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    const token = jwt.sign(userForToken, SECRET,{ expiresIn: 60*60 })

    return res.status(200).json({token, username: user.username, id: user._id, SECRET})
})

module.exports = loginRouter