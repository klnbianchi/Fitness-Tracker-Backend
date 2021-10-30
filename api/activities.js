const express = require("express");
const activitiesRouter = express.Router();
const {
  getAllActivities,
  createActivity,
  updateActivity,
  getPublicRoutinesByActivity,
} = require("../db");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res, next) => {
  try {
    const allActivities = await getAllActivities();

    res.send(allActivities);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.post("/", async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const newActivity = await createActivity({ name, description });
    res.send(newActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId: id } = req.params;
  const { name, description } = req.body;

  try {
    const updatedActivity = await updateActivity({ id, name, description });
    res.send(updatedActivity);
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.get("/:activityId/routines", async (req, res, next) => {
  const { activityId: id } = req.params;
  try {
    const routines = await getPublicRoutinesByActivity({ id });
    res.send(routines);
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = activitiesRouter;
