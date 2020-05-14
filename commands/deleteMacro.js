import { MessageEmbed } from 'discord.js'
import { getMacroName } from '../util/extractMacro.js'
import Sequelize from 'Sequelize'

export const attributes = {
  name: 'deleteMacro',
  aliases: ['destroy', 'delete', 'remove', 'd']
}

// delete macro and all things related
export async function run (client, message, extra) {
  const admin = message.member.hasPermission('MANAGE_MESSAGES') // checks for admin permissions
  const macroName = getMacroName(message, extra)
  console.log(macroName)
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
    // has permissions?
    if (macro.author.discordId !== message.author.id || !admin) {
      const reply = new MessageEmbed()
        .setAuthor('You cannot delete this macro!')
        .setDescription(`Only it's author <@${macro.author.discordId}> or an administrator with the "Manage Messages" permission can delete a macro.`)
        .setColor('101D42')
      await message.channel.send('', reply)
      return
    }

    // delete macro
    macro.destroy()

    // check if guild has any more macros
    const guildHasMoreMacros = !!await client.db.models.get('macro').findOne({
      include: client.db.models.get('author'),
      where: { guildDiscordId: message.guild.id }
    })
    // delete guild if redundant
    if (!guildHasMoreMacros) {
      const guilds = await client.db.models.get('guild').findAll({
        where: {
          discordId: message.guild.id
        }
      })
      for (const guild of guilds) {
        guild.destroy()
      }
    }

    // check if author has any more macros
    const authorHasMoreMacros = !!await client.db.models.get('macro').findOne({
      include: client.db.models.get('author'),
      where: { authorDiscordId: message.author.id }
    })
    // delete author if redundant
    if (!authorHasMoreMacros) {
      const authors = await client.db.models.get('author').findAll({
        where: {
          discordId: message.author.id
        }
      })
      for (const author of authors) {
        author.destroy()
      }
    }

    // send confirmation
    const reply = new MessageEmbed()
      .setAuthor('Macro has been deleted!')
      .setDescription(`Sucessfuly removed macro \`${
        macroName.replace(' ', '').length !== macroName.length // has spaces?
          ? `"${macroName}"` : macroName // wrap in double quotes / use raw
      }\`${ // admin override?
        macro.author.discordId !== message.author.id && admin ? ` by <@${macro.author.discordId}>` : ''
      }${ // deleted macro only?
        authorHasMoreMacros && guildHasMoreMacros ? '.'
          : !authorHasMoreMacros && !guildHasMoreMacros ? ' and accompanying metadata.' : !authorHasMoreMacros ? ' and accompanying user data.' : ' and accompanying guild data.'
        }`
      )
      .setFooter(`*id:* ${macro.id}`)
      .setColor('101D42')
    await message.channel.send('', reply)
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
