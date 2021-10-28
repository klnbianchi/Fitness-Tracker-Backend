// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();

const jwt = require ('jsonwebtoken');
const {JWT_SECRET} = process.env;

const {getUserById} = require('../db')
const usersRouter = require('./users');
const activitiesRouter= require('./activities');
const routinesRouter = require('./routines');

apiRouter.use(async (req, res, next) => {
  const prefix = 'Bearer ';
  const auth = req.header('Authorization');

  if (!auth) { // nothing to see here
    next();
  } else if (auth.startsWith(prefix)) {
    const token = auth.slice(prefix.length);

    try {
      const { id } = jwt.verify(token, JWT_SECRET);

      if (id) {
        req.user = await getUserById(id);
        next();
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  } else {
    next({
      name: 'AuthorizationHeaderError',
      message: `Authorization token must start with ${ prefix }`
    });
  }
});

apiRouter.use((req, res, next) => {
  if (req.user) {
    console.log("User is set:", req.user);
  }

  next();
});

apiRouter.use('/users', usersRouter);
apiRouter.use('/activities', activitiesRouter);
apiRouter.use('/routines', routinesRouter);


apiRouter.get('/health', async (req, res)=>{
    try{
      res.send({message:"connected!"})
    }catch(error){
        console.error(error);
        next(error)
    }
      
  });


module.exports = apiRouter;