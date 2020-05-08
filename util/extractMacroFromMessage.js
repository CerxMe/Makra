export default function (message, extra) {
  // get msg string without the command
  const msg = message.content.slice(extra.prefix.length + extra.commandName.length)
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

  macrostr = macrostr.toLocaleLowerCase() // TODO: Setting to disable this
  content = content.replace(/^(\s*)/, '') // get rid of the whitespace left behind
  return { macrostr, content }
}
