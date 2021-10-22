// -createUser
const  client  = require("./client");

const bcrypt = require("bcrypt");

async function createUser({ username, password }) {
  const SALT_COUNT = 10;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_COUNT )    // insert the correct fields into the reports table
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
// make sure to hash the password before storing it to the database

// -getUser

// getUser({ username, password })
// this should be able to verify the password against the hashed password

async function getUser({ username, password }) {
  try {
    const user = await getUserByUserName(username);
    const hashedPassword = user.password;
console.log (user, "user!!!!!")
    const compare = await bcrypt.compare(
      password,
      hashedPassword,);
    //   function (err, passwordsMatch) {
    //     if (passwordsMatch) {
    //       delete user.password;
    //       return user;
    //       // return the user object (without the password)
    //     } else {
    //       return 
    //     }
    // }
    
    if (!compare) {
        return 
    } 
    delete user.password
    return user
  } catch (error) {
    throw error;
  }
}

// -getUserById

// getUserById(id)
// select a user using the user's ID. Return the user object.
// do NOT return the password
async function getUserById(id){

    try{
    const { rows: [user]} = await client.query(`
          SELECT *
          FROM users
          WHERE "id" = ${id};
        `);
    delete user.password;
        return user;
    }catch(error){
      console.error(error)
    }
    }


// -getUserByUsername
// getUserByUsername(username)
// select a user using the user's username. Return the user object.
async function getUserByUserName(username){

try{
const { rows: [user] } = await client.query(`
      SELECT *
      FROM users
      WHERE username=$1;
    `, [username]);

    return user;
}catch(error){
  console.error(error)
}
}
module.exports = {
  createUser,
  getUser,
  getUserById,
  getUserByUserName,
};
