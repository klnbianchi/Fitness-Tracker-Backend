const client = require("./client");

async function getRoutineActivityById(id) {
  try {
    const {
      rows: [routineActivity],
    } = await client.query(`
          SELECT *
          FROM routineActivity
          WHERE "id" = ${id};
        `);
    return routineActivity;
  } catch (error) {
    console.error(error);
  }
}

async function addActivityToRoutine({
  routineId,
  activityId,
  count,
  duration,
}) {
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

    return deletedActivity;
  } catch (error) {
    throw error;
  }
}

async function getRoutineActivitiesByRoutine({id}) {
  try {
    const {
      rows: routineActivities,
    } = await client.query(
      `
SELECT *
FROM routineActivities
WHERE "routineId" = $1;
`,
      [id]
    );

    return routineActivities;
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  addActivityToRoutine,
  updateRoutineActivity,
  destroyRoutineActivity,
  getRoutineActivityById,
  getRoutineActivitiesByRoutine,
};
