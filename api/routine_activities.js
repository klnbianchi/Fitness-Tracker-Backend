const express = require("express");
const routineActivitiesRouter = express.Router();
const {
    getRoutineActivityById,
    destroyRoutineActivity,
    updateRoutineActivity,
    getRoutineById

} = require('../db');
const { requireUser } = require('./utils');

routineActivitiesRouter.patch("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId: id } = req.params;
    const { count, duration } = req.body;
    const { id: userId } = req.user;
    try {
        const routineActivity = await getRoutineActivityById(id)
        const routine = await getRoutineById(routineActivity.routineId);
        if (routine.creatorId === userId) {
            const updatedRoutineActivity = await updateRoutineActivity({ id, count, duration });
            res.send(updatedRoutineActivity);

        } else {
            next({
                name: "UnauthorizedUserError",
                message: "you cannot edit a routine that isn't yours",
            });
        }

    } catch ({ name, message }) {
        next({ name, message });
    }
});

routineActivitiesRouter.delete("/:routineActivityId", requireUser, async (req, res, next) => {
    const { routineActivityId: id } = req.params;
    console.log(req.params)
    try {
        const routineActivity = await getRoutineActivityById(id)
        const routine = await getRoutineById(routineActivity.routineId);

        if (req.user.id === routine.creatorId) {

            const deletedRoutineActivity = await destroyRoutineActivity(id);

            res.send(deletedRoutineActivity);
        } else {
            next({
                name: 'Cannot Delete',
                message: 'Permission not granted',
            });
        }
    } catch ({ name, message }) {
        next({ name, message });
    }
});


module.exports = routineActivitiesRouter;