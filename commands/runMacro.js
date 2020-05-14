import { MessageEmbed } from 'discord.js'
import { getMacroName } from '../util/extractMacro.js'
import { escapeMacroName, escapeMacroContent } from '../util/escapeMacro.js'

export default async function (client, message, extra) {
  const macrostr = getMacroName(message, extra)
  const macroName = escapeMacroName(macrostr)

  // empty message calls help command
  if (!macroName) {
    const helpCommand = client.commands.get('help')
    helpCommand.run(client, message)
    return
  }

  // search for macro
  const macro = await client.db.models.get('macro').findOne({
    where: {
      name: macroName,
      guildDiscordId: message.guild.id
    }
  })
  // macro exists
  if (macro) {
    // send macro
    // TODO: bump stats
    message.channel.send(`${escapeMacroContent(macro.content)}`)
  } else {
    if (macroName.replace(/`/g, '!`').length !== macroName.length) {
      const reply = new MessageEmbed()
        .setAuthor('Macro name can\'t have backtick!')
        .setDescription('Macros cannot contain the backtick (\`) character.')
        .setColor('F42C04')
      await message.channel.send('', reply)
      return
    }
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
