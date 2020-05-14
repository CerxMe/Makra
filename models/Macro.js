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
      allowNull: false
    },
    content: Sequelize.TEXT
  }, { sequelize, modelName: 'macro' })
  return Macro
}

export async function associate (models, sequelize) {
  models.get('macro').belongsTo(models.get('guild'))
  models.get('macro').belongsTo(models.get('author'))
  //
  // // auto-fill author if they don't exist
  // models.get('macro')
  //   .beforeCreate(async (val, options) => {
  //     // // get guild
  //     // const guild = await models.get('guild').findOrCreate(
  //     //   {
  //     //     where: { discordId: options.defaults.guild.id },
  //     //     defaults: { description: options.defaults.guild.name }
  //     //   }).spread((found, created) => {
  //     //   return found
  //     // })
  //     // delete options.defaults.guild
  //     // val.guildId = guild.get('id')
  //     console.log(options.defaults.author)
  //     // get author
  //     const author = await models.get('author').findOrCreate(
  //       {
  //         where: { discordId: options.defaults.author.discordId }
  //       }).spread((found, created) => {
  //       return found
  //     })
  //     delete options.defaults.author
  //     val.authorId = author.get('id')
  //     return { val, options }
  //   })
}
