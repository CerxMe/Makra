import Sequelize from 'sequelize'
import loadModels from './models/index.js'

export default async function () {
  try {
    // set up connection
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      sync: process.env.DATABASE_FORCE_SYNC === true ? { force: true } : undefined,
      dialect: process.env.DATABASE_DIALECT
    })

    // test connection
    await sequelize.authenticate()
    console.log('Database connection authenticated')

    // load up models
    await loadModels(sequelize)
    console.log('All models loaded')

    return sequelize
  } catch (err) {
    console.log(err)
  }
}
