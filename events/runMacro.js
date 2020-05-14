// Command handler
import { MessageEmbed } from 'discord.js'

export default async function (client, message, extra) {
  const { prefix } = extra
  const macroName = message.content.slice(prefix.length).trim()

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
    // send macro
    // TODO: bump stats
    message.channel.send(`${macro.content}`)
  } else {
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
