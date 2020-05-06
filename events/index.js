/*  Event handler registration
 */
import ready from './ready.js'
import message from './message.js'

export default async function (client) {
  client.on('ready', () => ready(client))
  client.on('message', () => message(client))
}
