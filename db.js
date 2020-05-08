import Sequelize from 'sequelize'
import loadModels from './models/index.js'

export default async function (client) {
  try {
    // set up connection
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      sync: process.env.DATABASE_FORCE_SYNC === true ? { force: true } : undefined,
      dialect: process.env.DATABASE_DIALECT
    })

    // load up models
    const models = await loadModels(client, sequelize)
    console.log('All models loaded')

    // test connection
    await sequelize.authenticate()
    console.log('Database connection authenticated')

    await sequelize.sync(process.env.DATABASE_FORCE_SYNC === true ? { force: true } : undefined)
    console.log('Database synchronized')

    return { sequelize, models }
  } catch (err) {
    console.log(err)
  }
}
