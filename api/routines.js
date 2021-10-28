const express = require("express");
const routinesRouter = express.Router();

const {
  getUserById,
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutinesWithoutActivities,
  destroyRoutine,
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
  destroyRoutineActivity,
} = require(`../db`);

const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res, next) => {
  try {
    const allPublicRoutines = await getAllPublicRoutines();

    res.send(allPublicRoutines);
  } catch (error) {
    console.log(error);
    next(error);
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
  console.log(req.params);
  try {
    const routineToDelete = await getRoutineById(routineId);
    console.log(routineToDelete, "routine to delete");
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
      console.log(deletedRoutine, 'deletedRoutine');
      res.send({ ...deletedRoutine, success: true });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

module.exports = routinesRouter;
