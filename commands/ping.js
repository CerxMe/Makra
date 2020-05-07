export const attributes = {
  name: 'ping',
  aliases: [],
  command: 'ping'
}

export async function run (client, message) {
  message.reply('pong!')
}
