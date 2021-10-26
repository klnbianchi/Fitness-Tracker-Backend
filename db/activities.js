const client = require("./client");

async function getActivityById(id) {
    try {
        const {
            rows: [activity],
        } = await client.query(
            `
SELECT *
FROM activities
WHERE id = $1;
`,[id]
        );

        return activity;
    } catch (error) {
        console.error(error);
    }
}

async function getAllActivities() {
    try {
        const { rows: allActivities } = await client.query(`
SELECT *
FROM activities;
`);

        return allActivities;
    } catch (error) {
        console.error(error);
    }
}

async function createActivity({ name, description }) {
    try {
        const {
            rows: [activity],
        } = await client.query(`
        INSERT INTO activities (name, description)
        VALUES ($1, $2)
        RETURNING *;
        `, [name, description]);

        return activity;
    } catch (error) {
        console.error(error);
    }
}

async function updateActivity({ id, name, description }) {
    try {
        const {
            rows: [updatedActivity],
        } = await client.query(`
UPDATE activities
SET name = $1,description = $2
WHERE "id" = ${id}
RETURNING *;

`,[name,description] );


        return updatedActivity;
    } catch (error) {
        console.error(error);
    }
}

async function attachActivitiesToRoutines(routines) {
    // no side effects
    const routinesToReturn = [...routines];
    const binds = routines.map((_, index) => `$${index + 1}`).join(', ');
    const routineIds = routines.map(routine => routine.id);
    if (!routineIds?.length) return;
   
    try {
      // get the activities, JOIN with routine_activities (so we can get a routineId), and only those that have those routine ids on the routine_activities join
      const { rows: activities } = await client.query(`
        SELECT activities.*, routineActivities.duration, routineActivities.count, routineActivities.id AS "routineActivityId", routineActivities."routineId"
        FROM activities 
        JOIN routineActivities ON routineActivities."activityId" = activities.id
        WHERE routineActivities."routineId" IN (${ binds });
      `, routineIds);
  
      // loop over the routines
      for(const routine of routinesToReturn) {
        // filter the activities to only include those that have this routineId
        const activitiesToAdd = activities.filter(activity => activity.routineId === routine.id);
        // attach the activities to each single routine
        routine.activities = activitiesToAdd;
      }
      return routinesToReturn;
    } catch (error) {
      throw error;
    }
  }

module.exports = {  updateActivity, getActivityById, getAllActivities, createActivity, attachActivitiesToRoutines };
