import { commands, ExtensionContext, Uri } from 'vscode'
import { completionComments } from '../openai/api/completionComments'
import { commentPrompt } from '../openai/prompt/commentPrompt'
import { explainPrompt } from '../openai/prompt/explainPrompt'
import { compareFileToClipboard } from '../utils/compareFileToClipboard'
import {
  COMPLETION_COMMENTS_COMMAND_ID,
  COMPLETION_EXPLAIN_COMMAND_ID,
} from './openaiCommands'

export function registerCompletionCommand(context: ExtensionContext) {
  _registerCommand(context, COMPLETION_COMMENTS_COMMAND_ID, commentPrompt)
  _registerCommand(context, COMPLETION_EXPLAIN_COMMAND_ID, explainPrompt)
}

function _registerCommand(
  context: ExtensionContext,
  commandId: string,
  scopedPrompt: () => Promise<string>
) {
  const commandHandler = async (uri: Uri) => {
    try {
      const prompt = await scopedPrompt()
      const solution = await completionComments(prompt)
      compareFileToClipboard(solution)
    } catch (error) {
      console.log(error)
    }
  }
  context.subscriptions.push(
    commands.registerCommand(commandId, commandHandler)
  )
}
