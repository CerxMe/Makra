import Sequelize from 'sequelize'
const { Model, DataTypes } = Sequelize

export async function init (sequelize) {
  class Macro extends Model {}
  Macro.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4
    },
    content: DataTypes.TEXT
  }, { sequelize, modelName: 'Macro' })
  return Macro
}
