const express = require("express");
const usersRouter = express.Router();
const { createUser, getUserByUserName } = require("../db");
const jwt = require('jsonwebtoken');

usersRouter.post('/register', async (req, res, next) => {
    const { username, password } = req.body;
    try {
        const _user = await getUserByUserName(username);

        if (_user) {
            next({
                name: 'UserExistsError',
                message: 'A user by that username already exists'
            });
        }

        if (password.length < 8) {
            next({
                name: 'PasswordTooShort',
                message: 'Password must be at least 8 characters'
            });
        }
        const user = await createUser(req.body);

        const token = jwt.sign({
            id: user.id,
            username
        }, process.env.JWT_SECRET, {
            expiresIn: '1w'
        });

        res.send({
            messsage: "thank you for signing up",
            token
        })
    } catch ({ name, message }) {
        next({ name, message })
    }
});

module.exports = usersRouter;
