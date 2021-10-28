// create an api router
// attach other routers from files in this api directory (users, activities...)
// export the api router
const express = require("express");
const apiRouter = express.Router();

const jwt = require ('jsonwebtoken');
const {JWT_SECRET} = process.env;

const usersRouter = require('./users');
const activitesRouter= require('./activities');
const activitiesRouter = require("./activities");

// apiRouter.use(async (req, res, next) => {
//     const prefix = 'Bearer ';
//     const auth = req.header('Authorization');
  
//     if (!auth) {
//       next();
//     } else if (auth.startsWith(prefix)) {
//       const token = auth.slice(prefix.length);
  
//       try {
//         const { id } = jwt.verify(token, JWT_SECRET);
  
//         if (id) {
//           req.user = await getUserById(id);
//           next();
//         }
//       } catch ({ name, message }) {
//         next({ name, message });
//       }
//     } else {
//       next({
//         name: 'AuthorizationHeaderError',
//         message: `Authorization token must start with ${prefix}`
//       });
//     }
//   });

  apiRouter.use('/users', usersRouter);
apiRouter.use('/activities', activitiesRouter);

// health check
// GET /health
// A common need is to see if our server is up (not completely crashed). We can create a route to send back a message, just a string saying all is well.

apiRouter.get('/health', async (req, res)=>{
    try{
      res.send({message:"connected!"})
    }catch(error){
        console.error(error);
        next(error)
    }
      
  });

// users
// POST /users/register
// Create a new user. Require username and password, and hash password before saving user to DB. Require all passwords to be at least 8 characters long.

// Throw errors for duplicate username, or password-too-short.

// POST /users/login
// Log in the user. Require username and password, and verify that plaintext login password matches the saved hashed password before returning a JSON Web Token.

// Keep the id and username in the token.

// GET /users/me (*)
// Send back the logged-in user's data if a valid token is supplied in the header.

// GET /users/:username/routines
// Get a list of public routines for a particular user.

// activities
// GET /activities
// Just return a list of all activities in the database

// POST /activities (*)
// Create a new activity

// PATCH /activities/:activityId (*)
// Anyone can update an activity (yes, this could lead to long term problems a la wikipedia)

// GET /activities/:activityId/routines
// Get a list of all public routines which feature that activity

// routines
// GET /routines
// Return a list of public routines, include the activities with them

// POST /routines (*)
// Create a new routine

// PATCH /routines/:routineId (**)
// Update a routine, notably change public/private, the name, or the goal

// DELETE /routines/:routineId (**)
// Hard delete a routine. Make sure to delete all the routineActivities whose routine is the one being deleted.

// POST /routines/:routineId/activities
// Attach a single activity to a routine. Prevent duplication on (routineId, activityId) pair.

// routine_activities
// PATCH /routine_activities/:routineActivityId (**)
// Update the count or duration on the routine activity

// DELETE /routine_activities/:routineActivityId (**)
// Remove an activity from a routine, use hard delete


module.exports = apiRouter;