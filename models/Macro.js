import { Model, DataTypes } from 'sequelize'

export default async function (sequelize) {
  class Macro extends Model {}
  Macro.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    description: DataTypes.TEXT
  }, { sequelize, modelName: 'Macro' })
  return Macro
}
