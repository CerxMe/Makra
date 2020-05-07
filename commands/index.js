// register commands
import fs from 'fs'
import { Collection } from 'discord.js'

export default async function (client) {
  try {
    const commands = new Collection()

    const commandFiles = fs.readdirSync('./commands')
      .filter(file => file !== 'index.js') // Exclude this file.

    // console.log(commandFiles)
    for (const file of commandFiles) {
      const { attributes, run } = await import(`./${file}`)
      console.log(`Loaded command ${attributes.name} from file ${file}`)
      commands.set(attributes.name, { ...attributes, run })
    }
    return commands
  } catch (e) {
    console.log(e)
  }
}
