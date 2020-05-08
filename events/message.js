// Command handler
export default function (client, message) {
  // Ignore Direct Messages and bot users
  if (message.channel.type !== 'text' || message.author.bot) return

  // Ignore messages that are not starting with the bot prefix
  const prefix = '$m'
  if (!message.content.startsWith(prefix)) return

  const args = message.content.slice(prefix.length).split(/ +/)
  const commandName = args.shift().toLowerCase()

  const command = client.commands.find(cmd => cmd.name === commandName || (cmd.aliases && cmd.aliases.includes(commandName)))

  if (!command) return

  try {
    command.run(client, message, { prefix, commandName })
  } catch (error) {
    console.error(error)
    message.reply('There was an error trying to execute that command!')
  }
}
