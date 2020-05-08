import extractMacroFromMessage from '../util/extractMacroFromMessage.js'

export const attributes = {
  name: 'createMacro',
  aliases: ['create', 'c', 'new']
}

// Create new macro
export async function run (client, message, extra) {
  // Get macro from msg
  const { macrostr, content } = extractMacroFromMessage(message, extra)

  // Try saving macro
  message.channel.send(`macrostr = \`${macrostr}\`\ncontent = \`${content}\``)
}
