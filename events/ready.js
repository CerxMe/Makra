// when client is ready
export default async (client) => {
  // set the bot's status
  await client.user.setPresence({ activity: { name: '$m', type: 'LISTENING' }, status: 'dnd' })
  console.log('Ready!')
}
