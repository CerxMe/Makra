import Sequelize from 'sequelize'

export async function init (sequelize) {
  class Macro extends Sequelize.Model {}
  Macro.init({
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    name: {
      type: Sequelize.TEXT,
      unique: true,
      allowNull: false
    },
    content: Sequelize.TEXT
  }, { sequelize, modelName: 'macro' })
  return Macro
}

export async function associate (models, sequelize) {
  models.get('macro').belongsTo(models.get('guild'))
  models.get('macro').belongsTo(models.get('author'))
}
