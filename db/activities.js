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

module.exports = {  updateActivity, getActivityById, getAllActivities, createActivity };
