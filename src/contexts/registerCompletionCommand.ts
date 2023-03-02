import { commands, ExtensionContext, Uri } from 'vscode'
import { completionComments } from '../openai/api/completionComments'
import { bountyPrompt } from '../openai/prompt/bountyPrompt'
import { commentPrompt } from '../openai/prompt/commentPrompt'
import { explainPrompt } from '../openai/prompt/explainPrompt'
import { optimizePrompt } from '../openai/prompt/optimizePrompt'
import { compareFileToClipboard } from '../utils/compareFileToClipboard'
import {
  PROMPT_BOUNTY_COMMAND_ID,
  PROMPT_COMMENTS_COMMAND_ID,
  PROMPT_EXPLAIN_COMMAND_ID,
  PROMPT_OPTIMIZE_COMMAND_ID,
} from './openaiCommands'

export function registerCompletionCommand(context: ExtensionContext) {
  _registerCommand(context, PROMPT_COMMENTS_COMMAND_ID, commentPrompt)
  _registerCommand(context, PROMPT_EXPLAIN_COMMAND_ID, explainPrompt)
  _registerCommand(context, PROMPT_BOUNTY_COMMAND_ID, bountyPrompt)
  _registerCommand(context, PROMPT_OPTIMIZE_COMMAND_ID, optimizePrompt)
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
