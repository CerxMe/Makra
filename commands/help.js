export const attributes = {
  name: 'help',
  aliases: ['create', 'c', 'new']
}

// Create new macro
export async function run (client, message, extra) {
  // TODO: reply with a help message
  message.channel.send('TODO: reply with a help message')
}
