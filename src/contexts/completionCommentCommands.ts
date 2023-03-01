import { commands, ExtensionContext, Uri, window, workspace } from 'vscode'
import { completionComments } from '../openai/completionComments'
import { compareFileToClipboard } from '../utils/compareFileToClipboard'
import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../utils/getActiveTextLanguageId'
import { COMPLETION_COMMENTS_COMMAND_ID } from './openaiCommands'

export function registerCompletionComment(context: ExtensionContext) {
  _registerCompletionComment(context)
}

function _registerCompletionComment(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    try {
      const language = getActiveTextLanguageId()

      const persona = `Act like a programming expert in ${language}.\n`
      const request = `Given the following code, add comments to explain any complex logic:\n`
      const sourceCode = `\n${getActiveTextEditorValue()}\n\n`
      const rules = `Add a comment next to each line that requires an explanation. Only add comments if the code is complex enough to require an explanation. The prompt should only return the original code with the comments included.\n`
      const prompt = persona.concat(request, sourceCode, rules)
      //console.log(prompt)
      const solution = await completionComments(prompt)

      compareFileToClipboard(solution)

    } catch (error) {
      console.log(error)
    }
  }
  context.subscriptions.push(
    commands.registerCommand(COMPLETION_COMMENTS_COMMAND_ID, commandHandler)
  )
}
