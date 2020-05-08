export const attributes = {
  name: 'test'
}

export async function run (client, message) {
  try {
    const newGuild = await client.db.models.guild.create({
      discordId: 'test',
      description: 'test'
    })
    message.channel.send('```' + newGuild + '```')
  } catch (e) {
    console.log(e)
    message.channel.send('```' + e + '```')
  }
}
