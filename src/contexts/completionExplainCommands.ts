import { commands, ExtensionContext, Uri, window, workspace } from 'vscode'
import { completionComments } from '../openai/completionComments'
import { compareFileToClipboard } from '../utils/compareFileToClipboard'
import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
import { getActiveTextLanguageId } from '../utils/getActiveTextLanguageId'
import { COMPLETION_EXPLAIN_COMMAND_ID } from './openaiCommands'

export function registerCompletionExplain(context: ExtensionContext) {
  _registerCompletionExplain(context)
}

function _registerCompletionExplain(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    try {
      const language = getActiveTextLanguageId()

      const persona = `Act like a programming expert in ${language}.\n`
      const request = `Add header comments to the following code to explain the purpose, input parameters, and output of each function:\n`
      const sourceCode = `\n${getActiveTextEditorValue()}\n\n`
      const rules = `Add a comment above each function definition that includes a description of what the function does, its function parameters, and the function return type. The prompt should only return the original code with the header comments included.\n`
      const prompt = persona.concat(request, sourceCode, rules)
      //console.log(prompt)
      const solution = await completionComments(prompt)

      compareFileToClipboard(solution)
    } catch (error) {
      console.log(error)
    }
  }
  context.subscriptions.push(
    commands.registerCommand(COMPLETION_EXPLAIN_COMMAND_ID, commandHandler)
  )
}
