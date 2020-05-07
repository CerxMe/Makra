import Discord from 'discord.js'
import dotenv from 'dotenv'
import eventHandler from './events/index.js'
import databaseConnection from './db.js'

import loadCommands from './commands/index.js'

// initialization
(async () => {
  try {
    // populate env variables from .env file
    dotenv.config()

    // spin up discord
    const client = new Discord.Client()

    // establish database connection and do data things
    client.db = await databaseConnection()

    // register command files
    client.commands = await loadCommands(client)
    console.log('All commands loaded')

    // load up event handler
    await eventHandler(client)

    // log in the bot
    client.login(process.env.DISCORD_TOKEN)
  } catch (e) {
    // error? there's no errors.
    console.log(e)
    // kill it with fire!
    process.exit(e.code)
  }
})()
