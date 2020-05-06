import Discord from 'discord.js'
import dotenv from 'dotenv'
import eventHandler from './events/index.js'

// initialization
(async () => {
  // populate env variables from .env file
  dotenv.config()

  // load up event handler
  const client = new Discord.Client()
  await eventHandler(client)

  // log in the bot
  client.login(process.env.DISCORD_TOKEN)
})()
