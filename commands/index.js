import fs from 'fs'
import { Collection } from 'discord.js'

// register bot commands
export default async function (client) {
  const commandFiles = fs.readdirSync('./commands')
    .filter(file => file !== 'index.js') // Exclude this file.

  const commands = new Collection()
  for (const file of commandFiles) {
    const { attributes, run } = await import(`./${file}`)
    console.log(`Loaded command '${attributes.name}' from file '${file}'`)
    commands.set(attributes.name, { ...attributes, run })
  }
  return commands
}
