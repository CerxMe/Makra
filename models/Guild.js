import { Model, DataTypes } from 'sequelize'

export default async function (sequelize) {
  class Guild extends Model {}
  Guild.init({
    id: {
      type: DataTypes.STRING,
      unique: true
    },
    description: DataTypes.TEXT
  }, { sequelize, modelName: 'Macro' })
  return Guild
}
