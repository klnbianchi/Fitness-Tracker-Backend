const express = require("express");
const activitiesRouter = express.Router();
const{
getAllActivities,
createActivity,
updateActivity,
getPublicRoutinesByActivity,
}= require('../db');
const { requireUser } = require("./utils");

activitiesRouter.get('/', async (req, res, next)=>{
try{
    const allActivities = await getAllActivities();
    
    res.send(allActivities);
    
}catch(error){
    console.log(error);
    next(error);
}
});

activitiesRouter.post('/', async (req,res,next)=>{
    const {name, description} = req.body
try{
    const newActivity = await createActivity({name, description});
    res.send(newActivity)
}catch(error){
    console.error(error);
    next(error);
}
});

activitiesRouter.patch('/:activityId', requireUser, async (req,res, next)=>{
const {activityId:id} = req.params;
const {name, description } = req.body;

try{
const updatedActivity = await updateActivity({ id, name, description });
res.send(updatedActivity);

}catch(error){
console.error(error);
next(error)
}
});

activitiesRouter.get('/:activityId/routines', async (req, res, next)=>{
const {activityId: id} = req.params;
try{
const routines = await getPublicRoutinesByActivity({id});
res.send(routines);
}catch(error){
    console.error(error);
    next(error);
}
})
module.exports = activitiesRouter;