import { Util } from 'discord.js'
export function clean (text) {
  return Util.cleanContent(text)
}
export function escapeMacroName (macroName) {
  return Util.escapeMarkdown(macroName)
}
export function escapeMacroContent (content) {
  return content.replace(/@(everyone|here)/g, '@\u200b$1') // everyone and here mentions
}
