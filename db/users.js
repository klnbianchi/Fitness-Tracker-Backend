// -createUser
const client = require("./client");

const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT); // insert the correct fields into the reports table
    // remember to return the new row from the query
    const {
      rows: [user],
    } = await client.query(
      `
        INSERT INTO users(username, password)
        VALUES ($1, $2)
        RETURNING * 
        `,
      [username, hashedPassword]
    );

    delete user.password;

    return user;
  } catch (error) {
    throw error;
  }
}

async function getUser({ username, password }) {
  try {
    const user = await getUserByUserName(username);
    const hashedPassword = user.password;

    const compare = await bcrypt.compare(password, hashedPassword);

    if (!compare) {
      return;
    }
    delete user.password;
    return user;
  } catch (error) {
    throw error;
  }
}

async function getUserById(id) {
  try {
    const {
      rows: [user],
    } = await client.query(`
          SELECT *
          FROM users
          WHERE "id" = ${id};
        `);
    delete user.password;
    return user;
  } catch (error) {
    console.error(error);
  }
}

async function getUserByUserName(username) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      SELECT *
      FROM users
      WHERE username=$1;
    `,
      [username]
    );

    return user;
  } catch (error) {
    console.error(error);
  }
}
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
};
