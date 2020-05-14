import { MessageEmbed } from 'discord.js'
import { getFullMacro } from '../util/extractMacro.js'
export const attributes = {
  name: 'createMacro',
  aliases: ['create', 'c', 'new', 'set', 'make']
}

// Create new macro
export async function run (client, message, extra) {
  // Get macro from msg
  const { macrostr, content } = getFullMacro(message, extra)

  console.log(content)
  // Macro can't be empty
  if (!macrostr) {
    const reply = new MessageEmbed()
      .setAuthor('Macro name can\'t be empty!')
      .setDescription('No <NAME> was provided for a macro. Use `$mhelp` for help.')
      .setColor('F42C04')
    await message.channel.send('', reply)
    return
  }
  if (!content) {
    const reply = new MessageEmbed()
      .setAuthor('Macro content can\'t be empty!')
      .setDescription(`No <CONTENT> was provided for *${macrostr}*. Use \`$mhelp\` for help.`)
      .setColor('F42C04')
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
  if (guild[0] && author[0]) {
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
        .setDescription(`Use \`$m ${macrostr}\` to run your macro.`)
        .setColor('E58C8A')
        .setFooter(`${macro.dataValues.id}`)
      await message.channel.send('', reply)
    } else {
      // new macro was created
      const reply = new MessageEmbed()
        .setAuthor('Macro already exists!')
        .setDescription(`\`$m ${macrostr}\` is originally created by <@${macro.author.discordId}>.\n Inspect it with \`$minspect ${macrostr}\` for more information or use \`$mhelp\` for help.`)
        .setColor('F42C04')
        .setFooter(`${macro.dataValues.id}`)
      await message.channel.send('', reply)
    }
  }
}
