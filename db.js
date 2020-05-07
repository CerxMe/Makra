import Sequelize from 'sequelize'

export default async function () {
  try {
    // set up connection
    const sequelize = new Sequelize(process.env.DATABASE, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      sync: process.env.DATABASE_FORCE_SYNC === true ? { force: true } : undefined,
      dialect: process.env.DATABASE_DIALECT
    })

    await sequelize.authenticate()
    console.log('yay')
    return sequelize
  } catch (err) {
    console.log(err)
  }
}
