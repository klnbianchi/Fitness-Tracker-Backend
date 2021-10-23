const client = require("./client");

// -getRoutineById
// getRoutineById(id)
// return the routine
async function getRoutineById(id) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
SELECT *
FROM routines
WHERE id = $1;
`,
      [id]
    );

    return routine;
  } catch (error) {
    console.error(error);
  }
}

// -getRoutinesWithoutActivities
// select and return an array of all routines
async function getRoutinesWithoutActivities() {
  try {
    const { rows: allRoutines } = await client.query(`
SELECT *
FROM routines;
`);
    console.log(allRoutines);
    return allRoutines;
  } catch (error) {
    console.error(error);
  }
}

// -getAllRoutines
// select and return an array of all routines, include their activities
// async function getAllRoutines() {
//     try {
//         const { rows: routines_activities } = await client.query(`
// SELECT *,
// FROM routines_activities;
// INNER JOIN activities ON routines_activities."activityId" = activities.id
// `);

//     } catch (error) {
//         console.error(error);
//     }
// }

// -getAllPublicRoutines
// select and return an array of public routines, include their activities

// -getAllRoutinesByUser
// getAllRoutinesByUser({ username })
// select and return an array of all routines made by user, include their activities

// -getPublicRoutinesByUser
// getPublicRoutinesByUser({ username })
// select and return an array of public routines made by user, include their activities

// -getPublicRoutinesByActivity
// getPublicRoutinesByActivity({ id })
// select and return an array of public routines which have a specific activityId in their routine_activities join, include their activities

// -createRoutine
// createRoutine({ creatorId, isPublic, name, goal })
// create and return the new routine

async function createRoutine({ creatorId, isPublic, name, goal }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
        INSERT INTO routines ("creatorId", "isPublic", name, goal)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
      [creatorId, isPublic, name, goal]
    );

    return routine;
  } catch (error) {
    console.error(error);
  }
}

// -updateRoutine
// updateRoutine({ id, isPublic, name, goal })
// Find the routine with id equal to the passed in id
// Don't update the routine id, but do update the isPublic status, name, or goal, as necessary
// Return the updated routine

async function updateRoutine({ id, isPublic, name, goal }) {
  try {
    const {
      rows: [updatedRoutine],
    } = await client.query(
      `
UPDATE routines
SET "isPublic" = $1,name = $2,goal = $3
WHERE "id" = ${id}
RETURNING *;
`,
      [isPublic, name, goal]
    );

    return updatedRoutine;
  } catch (error) {
    console.error(error);
  }
}

// -destroyRoutine
// destroyRoutine(id)
// remove routine from database
// Make sure to delete all the routine_activities whose routine is the one being deleted.
async function destroyRoutine(id) {
  try {
    const {
      rows: [deleteRoutine],
    } = await client.query(
    `DELETE 
    FROM routines
    WHERE "id"=$1
    RETURNING *`,
      [id]
    );

    // await client.query(`
    // DELETE 
    // FROM routine_activities
    // WHERE "routineId"=$1`, [id])

    // return deleteRoutine;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  createRoutine,
  getRoutineById,
  updateRoutine,
  getRoutinesWithoutActivities,
  destroyRoutine,
};
