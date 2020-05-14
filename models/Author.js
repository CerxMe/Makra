import Sequelize from 'sequelize'

export async function init (sequelize) {
  class Author extends Sequelize.Model {}
  Author.init({
    discordId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    }
  }, { sequelize, modelName: 'author' })
  return Author
}

export async function associate (models, sequelize) {
  models.get('author').hasMany(models.get('macro'))
  models.get('author').belongsToMany(models.get('guild'), { through: 'GuildAuthor' })
}
