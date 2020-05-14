import extractMacroFromMessage from '../util/extractMacroFromMessage.js'
import { MessageEmbed } from 'discord.js'
export const attributes = {
  name: 'createMacro',
  aliases: ['create', 'c', 'new']
}

// Create new macro
export async function run (client, message, extra) {
  // Get macro from msg
  const { macrostr, content } = extractMacroFromMessage(message, extra)

  console.log(content)
  // Macro can't be empty
  if (!content) {
    const reply = new MessageEmbed()
      .setAuthor('Macro can\'t be empty!')
      .setDescription(`No <MACROCONTENT> was provided for *${macrostr}*. Use \`$mhelp\` for help.`)
      .setColor('101D42')
    await message.channel.send('', reply)
    return
  }

  // find guild
  const guild = await client.db.models.get('guild').findOrCreate({
    where: { discordId: message.guild.id }
  })
  // find author
  const author = await client.db.models.get('author').findOrCreate({
    where: { discordId: message.author.id }
  })
  if (guild[0]) {
    const { macro, found } = await client.db.models.get('macro').findOrCreate({
      include: client.db.models.get('author'),
      where: {
        name: macrostr,
        guildDiscordId: guild[0].discordId
      },
      defaults: {
        authorDiscordId: author[0].discordId,
        content
      }
    }).spread((macro, found) => {
      // format result
      return { macro, found }
    })

    // macro already existed
    if (found) {
      const reply = new MessageEmbed()
        .setAuthor('Macro set!')
        .setColor('89d2dc')
        .setFooter(`${macro.dataValues.id}`)
      await message.channel.send('', reply)
    } else { // new macro was created
      const reply = new MessageEmbed()
        .setAuthor('Macro already exists!')
        .setDescription(`Created by <@${macro.author.discordId}>`)
        .setColor('101D42')
        .setFooter(`${macro.dataValues.id}`)
      await message.channel.send('', reply)
    }
  }
  /*
  const { found, macro } = await client.db.models.get('macro').findOrCreate({
    where: { name: macrostr },
    defaults: {
      guild: message.guild,
      author: message.author,
      content
    }
  }).spread((found, created) => {
    return { found, created }
  })

  if (found) {
    message.channel.send(`${macro.get('id')}`)
  }
  */

  // message.channel.send(`${macro.get('id')}`)
  message.channel.send(`macrostr = \`${macrostr}\`\ncontent = \`${content}\``)
}
