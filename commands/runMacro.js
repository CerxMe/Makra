import { MessageEmbed } from 'discord.js'
import { getMacroName } from '../util/extractMacro.js'

export default async function (client, message, extra) {
  const macroName = getMacroName(message, extra)
  console.log(macroName)
  // TODO: empty message calls help command
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
    message.channel.send(`${macro.content}`)
  } else {
    // no macro
    const reply = new MessageEmbed()
      .setAuthor('Macro was not found!')
      .setDescription(`Create it with \`$mcreate ${
        macroName.replace(' ', '').length !== macroName.length // has spaces?
          ? `"${macroName}"` : macroName // wrap in double quotes / use raw
      } <MACROCONTENT>\` command.`)
      .setFooter('Use $mhelp for help.')
      .setColor('101D42')
    await message.channel.send('', reply)
  }
}
