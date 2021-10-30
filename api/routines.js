const express = require("express");
const routinesRouter = express.Router();

const {
  createRoutine,
  getRoutineById,
  updateRoutine,
  destroyRoutine,
  getAllPublicRoutines,
  addActivityToRoutine,
  getRoutineActivitiesByRoutine,
} = require(`../db`);

const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();

    res.send(allPublicRoutines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { isPublic, name, goal } = req.body;
  const { id: creatorId } = req.user;

  try {
    const newRoutine = await createRoutine({ creatorId, isPublic, name, goal });

    res.send(newRoutine);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId: id } = req.params;
  const { ...fields } = req.body;
  const { id: userId } = req.user;

  try {
    const routine = await getRoutineById(id);
    if (userId === routine.creatorId) {
      const updatedRoutine = await updateRoutine({ id, ...fields });
      res.send(updatedRoutine);
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

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;

  try {
    const routineToDelete = await getRoutineById(routineId);

    if (!routineToDelete) {
      next({
        name: "Routine does not exist",
        message: "Routine does not exist",
      });
    } else if (routineToDelete.creatorId !== req.user.id) {
      res.status(403);
      next({ name: "User Issue", messsage: "You are not the user!" });
    } else {
      const deletedRoutine = await destroyRoutine(routineId);

      res.send({ ...deletedRoutine, success: true });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.post("/:routineId/activities", async (req, res, next) => {
  const { routineId } = req.params;
  const { activityId, count, duration } = req.body;

  try {
    const activity = await getRoutineActivitiesByRoutine({ id: routineId });
    const filteredActivities = activity.filter(activities => {
      if (activities.activityId === activityId) {
        return true
      }
      return false;
    })

    if (filteredActivities.length) {
      next({
        name: "duplicate id",
        message: "activity id already exists"
      });

    } else {
      const routineWithActivity = await addActivityToRoutine({
        routineId,
        activityId,
        count,
        duration,
      }
      );
      res.send(routineWithActivity);
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});



module.exports = routinesRouter;
