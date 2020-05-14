import { MessageEmbed } from 'discord.js'
import { getMacroName } from '../util/extractMacro.js'
import { escapeMacroName } from '../util/escapeMacro.js'

export const attributes = {
  name: 'deleteMacro',
  aliases: ['destroy', 'delete', 'remove', 'd']
}

// delete macro and all things related
export async function run (client, message, extra) {
  const macrostr = getMacroName(message, extra)
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

  // macro exists
  if (macro) {
    const admin = message.member.hasPermission('MANAGE_MESSAGES') // checks for admin permissions
    // has permissions?
    if (!admin && macro.author.discordId !== message.author.id) {
      const reply = new MessageEmbed()
        .setAuthor('You cannot delete this macro!')
        .setDescription(`Only it's author <@${macro.author.discordId}> or an administrator with the "Manage Messages" permission can delete \`$m ${macroName}\`.`)
        .setColor('F42C04')
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
      .setFooter(`${macro.id}`)
      .setColor('E58C8A')
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
