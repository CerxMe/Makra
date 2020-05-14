import { getFullMacro } from '../util/extractMacro.js'
import { MessageEmbed } from 'discord.js'
import { escapeMacroName } from '../util/escapeMacro.js'

export const attributes = {
  name: 'editMacro',
  aliases: ['edit', 'change', 'e']
}

export async function run (client, message, extra) {
  const { macrostr, content } = getFullMacro(message, extra)
  const macroName = escapeMacroName(macrostr)

  // fuck backticks
  if (macroName.replace(/`/g, '!`').length !== macroName.length) {
    const reply = new MessageEmbed()
      .setAuthor('Macro name can\'t have backtick!')
      .setDescription('Macros cannot contain the backtick (\`) character.')
      .setColor('F42C04')
    await message.channel.send('', reply)
    return
  }

  // search for macro
  const macro = await client.db.models.get('macro').findOne({
    include: client.db.models.get('author'),
    where: {
      name: macrostr,
      guildDiscordId: message.guild.id
    }
  })

  // edit macro
  if (macro) {
    // save changes
    macro.set('content', content)
    await macro.save()

    // reply
    const reply = new MessageEmbed()
      .setAuthor('Macro changed!')
      .setDescription(`Use \`$m ${macroName}\` to run your macro.`)
      .setColor('E58C8A')
      .setFooter(`${macro.dataValues.id}`)
    await message.channel.send('', reply)
  } else {
    const reply = new MessageEmbed()
      .setAuthor('Macro was not found!')
      .setDescription(`Create it with \`$mcreate ${
        macroName.replace(' ', '').length !== macroName.length // has spaces?
          ? `"${macroName}" or use \`$mhelp\` for help.` : macroName // wrap in double quotes / use raw
      } <MACROCONTENT>\` command.`)
      .setColor('0F1A20')
    await message.channel.send('', reply)
  }
}
