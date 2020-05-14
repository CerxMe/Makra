import { MessageEmbed } from 'discord.js'
import { getMacroName } from '../util/extractMacro.js'
import moment from 'moment'

export const attributes = {
  name: 'inspect',
  aliases: ['i', 'info']
}

export async function run (client, message, extra) {
  const macroName = getMacroName(message, extra)

  // search for macro
  const macro = await client.db.models.get('macro').findOne({
    include: client.db.models.get('author'),
    where: {
      name: macroName,
      guildDiscordId: message.guild.id
    }
  })
  // macro exists
  if (macro) {
    // send data
    const reply = new MessageEmbed()
      .setAuthor('Macro inspection')
      .setDescription(`\`$m ${macroName}\` created by <@${macro.author.discordId}>`)
      .addField('Created:', moment(macro.createdAt).format('MMMM Do YYYY, h:mm:ss(Z) a'))
    console.log(macro.createdAt)
    console.log(macro.updatedAt)
    if (macro.createdAt.getMilliseconds() !== macro.updatedAt.getMilliseconds()) {
      reply.addField('Last updated:', moment(macro.updatedAt).format('MMMM Do YYYY, h:mm:ss(Z) a'))
    }
    reply
      .setFooter(`${macro.id}`)
      .setColor('E58C8A')
    await message.channel.send('', reply)
  } else {
    // no macro
    const reply = new MessageEmbed()
      .setAuthor('Macro was not found!')
      .setDescription(`Create it with \`$mcreate ${
        macroName.replace(' ', '').length !== macroName.length // has spaces?
          ? `"${macroName}"` : macroName // wrap in double quotes / use raw
      } <CONTENT>\` or use \`$mhelp\` for help.`)
      .setColor('0F1A20')
    await message.channel.send('', reply)
  }
}
