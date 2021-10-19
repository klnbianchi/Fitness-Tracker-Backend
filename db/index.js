// require and re-export all files in this db directory (users, activities...)
const { client } = require('./client');
const { rebuildDB } = require('./seedData')



module.exports={
    client,
    rebuildDB
}