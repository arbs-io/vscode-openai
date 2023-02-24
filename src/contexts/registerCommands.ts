import { commands, ExtensionContext, Uri, window } from 'vscode'
import { executePrompt } from '../prompts/executePrompt'
import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
import { getInputBox } from '../utils/getInputBox'
import { getQuickPick } from '../utils/getQuickPick'
import {
  OPENAI_UNITTEST_COMMAND_ID,
  OPENAI_FINDBUG_COMMAND_ID,
} from './openaiCommands'

export function registerCommands(context: ExtensionContext) {
  _registerSha512Command(context, OPENAI_UNITTEST_COMMAND_ID, 'todo')
  _registerSha512Command(context, OPENAI_FINDBUG_COMMAND_ID, 'todo')
}

function _registerSha512Command(
  context: ExtensionContext,
  openaiCommand: string,
  prompt: string
) {
  const commandHandler = async (uri: Uri) => {
    const editorValue = getActiveTextEditorValue()

    executePrompt()

    await getInputBox()
    await getQuickPick()
    window.showInformationMessage(`OpenAI: $copied to clipboard`)
  }
  context.subscriptions.push(
    commands.registerCommand(openaiCommand, commandHandler)
  )
}
