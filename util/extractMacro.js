import { clean } from './escapeMacro.js'
import { Util } from 'discord.js'

export function getFullMacro (message, extra) {
  // get msg string without the command
  const msg = Util.cleanContent(message.content, message).slice(extra.prefix.length + extra.commandName.length)
    .replace(/^(\s*)/, '') // get rid of the whitespace left behind

  // Extract macro name and content from msg string
  let macrostr
  let content = msg
  if (/^".*"/.test(msg)) {
    // Macro is a string with spaces
    macrostr = /".*"/.exec(msg)[0]
    content = content.replace(macrostr, '') // unfortunately, they need to be duped because of the ""
    macrostr = macrostr.slice(1, -1) // remove the ""
  } else {
    // Single string, stops when a space is spotted
    macrostr = /[^ ]*/.exec(msg)[0]
    content = content.replace(macrostr, '')
  }

  macrostr = macrostr.toLocaleLowerCase().trim() // TODO: Setting to disable this
  content = content.replace(/^(\s*)/, '') // get rid of the whitespace left behind
  return { macrostr, content }
}

export function getMacroName (message, extra) {
  // get msg string without the command
  let macrostr
  if (extra.commandName) {
    const msg = Util.cleanContent(message.content, message).slice(extra.prefix.length + extra.commandName.length)
      .replace(/^(\s*)/, '') // get rid of the whitespace left behind
    // Extract macro name from msg
    if (/^".*"/.test(msg)) {
      // Macro is a string with spaces
      macrostr = /".*"/.exec(msg)[0]
      macrostr = macrostr.slice(1, -1) // remove the ""
    } else {
      // Single string, stops when a space is spotted
      macrostr = msg.trim()
    }
    return macrostr.toLocaleLowerCase()
  } else { // run command
    const msg = Util.cleanContent(message.content, message).slice(extra.prefix.length)
      .replace(/^(\s*)/, '') // get rid of the whitespace left behind
    if (/^".*"/.test(msg)) {
      // Macro is a string with spaces
      macrostr = /".*"/.exec(msg)[0]
      macrostr = clean(macrostr.slice(1, -1), message).toLocaleLowerCase() // remove the ""
      return macrostr
    } else {
      const macroName = Util.cleanContent(message.content, message).slice(extra.prefix.length).trim().toLocaleLowerCase()
      return macroName
    }
  }
}
