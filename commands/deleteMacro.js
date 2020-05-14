export const attributes = {
  name: 'deleteMacro',
  aliases: ['delete', 'remove', 'removeMacro', 'd', 'r']
}

export async function run (client, message) {
  const admin = message.channel.permissionsFor(message.member).hasPermission('MANAGE_MESSAGES') // checks for admin permissions
}
