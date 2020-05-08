import Sequelize from 'sequelize'

export async function init (sequelize) {
  class Author extends Sequelize.Model {}
  Author.init({
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      defaultValue: Sequelize.UUIDV4
    },
    discordId: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, { sequelize, modelName: 'author' })
  return Author
}

export async function associate (models, sequelize) {
  models.get('author').hasMany(models.get('macro'))
  models.get('author').belongsToMany(models.get('guild'), { through: 'GuildAuthor' })
}
