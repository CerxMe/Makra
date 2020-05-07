import Sequelize from 'sequelize'
const { Model, DataTypes } = Sequelize

export async function init (sequelize) {
  class Author extends Model {}
  Author.init({
    discordId: DataTypes.STRING
  }, { sequelize, modelName: 'Author' })
  return Author
}
