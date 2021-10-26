const client = require("./client");
// getRoutineActivityById
// getRoutineActivityById(id)
// return the routine_activity

async function getRoutineActivityById(id){
    try{
    const { rows: [routineActivity]} = await client.query(`
          SELECT *
          FROM routineActivity
          WHERE "id" = ${id};
        `);
        return routineActivity;
    }catch(error){
      console.error(error)
    }
    }
// -addActivityToRoutine
// addActivityToRoutine({ routineId, activityId, count, duration })
// create a new routine_activity, and return it
async function addActivityToRoutine({ routineId, activityId, count, duration }) {
    try {
      const {
        rows: [routineActivities],
      } = await client.query(
        `
          INSERT INTO routineActivities ("routineId", "activityId", count, duration)
          VALUES ($1, $2, $3, $4)
          RETURNING *;
          `,
        [routineId, activityId, count, duration]
      );
  
      return routineActivities;
    } catch (error) {
      console.error(error);
    }
  }


// -updateRoutineActivity
// updateRoutineActivity({ id, count, duration })
// Find the routine with id equal to the passed in id
// Update the count or duration as necessary

async function updateRoutineActivity({ id, count, duration }) {
    try {
      const {
        rows: [routineActivities],
      } = await client.query(
        `
  UPDATE routineActivities
  SET count = $1, duration = $2
  WHERE "id" = ${id}
  RETURNING *;
  `,
        [count, duration]
      );
  
      return routineActivities;
    } catch (error) {
      console.error(error);
    }
  }

// -destroyRoutineActivity
// destroyRoutineActivity(id)
// remove routine_activity from database
async function destroyRoutineActivity(id) {
    try {
  
      const {
        rows: [deletedActivity],
      } = await client.query(
      `DELETE 
      FROM routineActivities
      WHERE id=$1
      RETURNING *;`,
        [id]
      );
//   console.log(deletedActivity)
  
     
  return deletedActivity
    } catch (error) {
      throw error;
    }
  }
// -getRoutineActivitiesByRoutine
async function getRoutineActivitiesByRoutine(id) {
    try {
        const {
            rows: [routineActivities],
        } = await client.query(
            `
SELECT *
FROM routineActivities
WHERE "routineId" = $1;
`,[id]
        );

        return routineActivities;
    } catch (error) {
        console.error(error);
    }
}

// getRoutineActivitiesByRoutine({ id })
// select and return an array of all routine_activity records
module.exports = {
    addActivityToRoutine,
updateRoutineActivity,
destroyRoutineActivity, 
getRoutineActivityById,
getRoutineActivitiesByRoutine
  };