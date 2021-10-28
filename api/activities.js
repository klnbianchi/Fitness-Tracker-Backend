const express = require("express");
const activitiesRouter = express.Router();
const{
getAllActivities,
}= require('../db')

activitiesRouter.get('/', async (req, res, next)=>{
try{
    const allActivities = await getAllActivities();
    
    res.send(allActivities);
    
}catch(error){
    console.log(error);
    next(error);
}
});

module.exports = activitiesRouter;