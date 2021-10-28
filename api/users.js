const express = require("express");
const usersRouter = express.Router();
const { 
    createUser,
    getUserByUserName, 
    getUser,
    getPublicRoutinesByUser,
 } = require("../db");
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
        const user = await createUser({username, password});

        res.send({
            messsage: "thank you for signing up",
            user: user
        })
    } catch ({ name, message }) {
        next({ name, message })
    }
});

usersRouter.post('/login', async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
        next({
            name: "MissingCredentialsError",
            message: "Please supply both a username and password"
        });
    }

    try {
        const user = await getUser({username, password});

        if (user) {
            const token = await jwt.sign({ id: user.id, username }, process.env.JWT_SECRET)
            res.send({ message: "you're logged in!", token: token });
        } else {
            next({
                name: 'IncorrectCredentialsError',
                message: 'Username or password is incorrect'
            });
    }
}
     catch (error) {
        console.log(error);
        next(error)
    }
});

// usersRouter.get('/me', async (req, res, next)=>{

// });

usersRouter.get('/:username/routines', async (req, res, next)=>{
const {username} = req.params;

try{
const routines = await getPublicRoutinesByUser({username});
res.send({routines});

}catch(error){
    console.log(error);
    next(error);
}
});

module.exports = usersRouter;
