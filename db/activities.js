const client = require("./client");
// -getActivityById
// getActivityById(id)
// return the activity
async function getActivityById(id) {
    try {
        const {
            rows: [activity],
        } = await client.query(
            `
SELECT *
FROM activities
WHERE id = $1;
`[id]
        );

        return activity;
    } catch (error) {
        console.error(error);
    }
}
// -getAllActivities
// select and return an array of all activities
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
// -createActivity
// createActivity({ name, description })
// return the new activity
async function createActivity({ name, description }) {
    try {
        const {
            rows: [activity],
        } = await client.query(`
        INSERT INTO activities (name, description)
        VALUE ($1, $2)
        RETURNING *;
        `, [(name, description)]);

        return activity;
    } catch (error) {
        console.error(error);
    }
}
// -updateActivity
// updateActivity({ id, name, description })
// don't try to update the id
// do update the name and description
// return the updated activity
async function updateActivity({ id, name, description }) {
    try {
        const {
            rows: [updatedActivity],
        } = await client.query(`
UPDATE activities
SET name = ${name},
SET description = ${description}
WHERE id = ${id}
RETURNING *;
`);

        return updateActivity;
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    
 };
