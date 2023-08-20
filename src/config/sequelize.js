require('dotenv').config()
const { Sequelize } = require('sequelize')

const pgsql = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'postgres',
})

pgsql
  .authenticate()
  .then(async () => {
    console.info(`Connection to ${process.env.DB_HOST}:${process.env.DB_NAME} SUCCESS`)
  })
  .catch((err) => {
    console.error(`Failed to connect to ${process.env.DB_HOST}:${process.env.DB_NAME} with error ${err}`)
  })

module.exports = pgsql