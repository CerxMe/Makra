import Sequelize from 'sequelize'
const { Model, DataTypes } = Sequelize

// model definition
export async function init (sequelize) {
  class Guild extends Model {}

  await Guild.init({
    discordId: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.TEXT
  }, { sequelize, modelName: 'Guild' })
  return Guild
}

export async function associate (sequelize) {
  // TODO
}
