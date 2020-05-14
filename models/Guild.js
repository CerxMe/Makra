import Sequelize from 'sequelize'

// model definition
export async function init (sequelize) {
  class Guild extends Sequelize.Model {}

  await Guild.init({
    discordId: {
      type: Sequelize.STRING,
      primaryKey: true,
      allowNull: false
    },
    description: Sequelize.TEXT
  }, { sequelize, modelName: 'guild' })
  return Guild
}

export async function associate (models, sequelize) {
  models.get('guild').hasMany(models.get('macro'))
  models.get('guild').belongsToMany(models.get('author'), { through: 'GuildAuthor' })
}
