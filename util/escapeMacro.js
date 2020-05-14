import { Util } from 'discord.js'
export function escapeMacroName (macroName) {
  return Util.escapeMarkdown(macroName)
}
export function escapeMacroContent (content) {
  return content.replace(/@(everyone|here)/g, '@\u200b$1') // everyone and here mentions
}
