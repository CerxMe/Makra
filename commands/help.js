import { MessageEmbed } from 'discord.js'

export const attributes = {
  name: 'help',
  aliases: ['create', 'c', 'new']
}

export async function run (client, message, extra) {
  // reply with a help message
  const reply = new MessageEmbed()
    .setAuthor('Makra - simple chat macros.', client.user.displayAvatarURL())
    .setDescription('Bot by <@81408444879339520>. DM me if anything breaks.')
    .setColor('0F1A20')
    .addField('Creating macros',
      '`$mcreate <NAME> <CONTENT>` to create a new macro.\n' +
      'If you wish to use a macro name with spaces, enclose the name parameter in parenthesis(double quotes) - i.e: `$m create "<NAME WITH SPACES>" <CONTENT>`' +
      '\n*Available aliases: $mc $mnew $mset $mmake*')
    .addField('Running a macro', '`$m <NAME>` will run your macro. Here you can use a name with spaces without any issues.')
    .addField('Deleting macros', '`$mdelete <NAME>` Macros can only be deleted by their author or an administrator with the "Manage Messages" permission. Deleting macros is permanent and will allow for creation of macros with the same name.' +
    '\n*Available aliases: $md $mdestroy $mremove*')
    .addField('Editing macros', '`$medit <NAME> <CONTENT>` Editing follows the same principles as macro creation, however here you use `$medit` command instead of `$mcreate`.' +
  '\n*Available aliases: $me $mchange*')
    .addField('Inspecting macros', '`$minspect <NAME>` Provides additional information about a specific macro.' +
  '\n*Available aliases: $mi $minfo*')
    .setFooter('https://github.com/CerxMe/Makra')

  await message.channel.send('', reply)
}
