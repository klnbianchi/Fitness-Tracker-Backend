const client = require("./client");
const { attachActivitiesToRoutines } = require("./activities");

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

async function getRoutinesWithoutActivities() {
  try {
    const { rows: allRoutines } = await client.query(`
SELECT *
FROM routines;
`);

    return allRoutines;
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutines() {
  try {
    const { rows: routines } = await client.query(`
SELECT routines.*, users.username AS "creatorName"
FROM routines
JOIN users ON routines."creatorId" = users.id;
`);

    return attachActivitiesToRoutines(routines);
  } catch (error) {
    console.error(error);
  }
}

async function getAllPublicRoutines() {
  try {
    const { rows: publicRoutines } = await client.query(`
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE "isPublic" = true;
`);

    return attachActivitiesToRoutines(publicRoutines);
  } catch (error) {
    console.error(error);
  }
}

async function getAllRoutinesByUser({ username }) {
  try {
    const { rows: userRoutines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username = $1;
    `,
      [username]
    );

    return attachActivitiesToRoutines(userRoutines);
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByUser({ username }) {
  try {
    const { rows: publicRoutines } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    WHERE users.username = $1
    AND "isPublic" = true;
    `,
      [username]
    );

    return attachActivitiesToRoutines(publicRoutines);
  } catch (error) {
    console.error(error);
  }
}

async function getPublicRoutinesByActivity({ id }) {
  try {
    const { rows: routinesByActivity } = await client.query(
      `
    SELECT routines.*, users.username AS "creatorName"
    FROM routines
    JOIN users ON routines."creatorId" = users.id
    JOIN routineActivities ON routines.id = routineActivities."routineId"
    WHERE routineActivities."activityId" = $1
    AND "isPublic" = true;
    `,
      [id]
    );

    return attachActivitiesToRoutines(routinesByActivity);
  } catch (error) {
    console.error(error);
  }
}

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

function dbFields(fields) {
  const insert = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  const select = Object.keys(fields)
    .map((_, index) => `$${index + 1}`)
    .join(", ");

  const vals = Object.values(fields);
  return { insert, select, vals };
}

async function updateRoutine({ id, ...fields }) {
  const { insert, select, vals } = dbFields(fields);
  try {
    const {
      rows: [updatedRoutine],
    } = await client.query(
      `
UPDATE routines
SET ${insert}
WHERE "id" = ${id}
RETURNING *;
`,
      vals
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
   const{rows: deletedRA} = await client.query(
      `
    DELETE 
    FROM routineActivities
    WHERE "routineId" = $1;
    `,
      [id]
    );

    const {rows:[deletedRoutines]} = await client.query(
      `
    DELETE 
    FROM routines
    WHERE routines.id = $1;
    `,
      [id]
    );

  return deletedRA, deletedRoutines;
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
  getAllRoutines,
  getAllPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutinesByUser,
  getPublicRoutinesByActivity,
};
