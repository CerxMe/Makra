export const attributes = {
  name: 'inspect',
  aliases: ['i', 'info']
}

export async function run (client, message) {
  message.reply('pong!')
}
