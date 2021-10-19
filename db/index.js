// require and re-export all files in this db directory (users, activities...)
const { client } = require('./client');
const { rebuildDB } = require('./seedData')

client.connect()
    .then(rebuildDB)
    .catch(console.error)
    .finally(() => client.end());

module.exports = {
    client,
    rebuildDB
}