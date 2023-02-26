import { commands, ExtensionContext, Uri, window } from 'vscode'
import { executePrompt } from '../openai/executePrompt'
import { getActiveTextEditorValue } from '../utils/getActiveTextEditorValue'
import { getInputBox } from '../utils/getInputBox'
import { getQuickPick } from '../utils/getQuickPick'
import { inputApiKeyOpenAI } from '../utils/inputApiKeyOpenAI'
import {
  OPENAI_UNITTEST_COMMAND_ID,
  OPENAI_FINDBUG_COMMAND_ID,
  OPENAI_UPDATE_APIKEY_COMMAND_ID,
} from './openaiCommands'

export function registerCommands(context: ExtensionContext) {
  _registerCommand(context, OPENAI_UNITTEST_COMMAND_ID, 'todo')
  _registerCommand(context, OPENAI_FINDBUG_COMMAND_ID, 'todo')

  _registerApiKeyCommand(context)
}

function _registerCommand(
  context: ExtensionContext,
  openaiCommand: string,
  prompt: string
) {
  const commandHandler = async (uri: Uri) => {
    const editorValue = getActiveTextEditorValue()

    await executePrompt()

    await getInputBox()
    await getQuickPick()
    window.showInformationMessage(`OpenAI: $copied to clipboard`)
  }
  context.subscriptions.push(
    commands.registerCommand(openaiCommand, commandHandler)
  )
}

function _registerApiKeyCommand(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    const apiKey = await inputApiKeyOpenAI()
    window.showInformationMessage(`Setting ApiKey: ${apiKey}`)
  }
  context.subscriptions.push(
    commands.registerCommand(OPENAI_UPDATE_APIKEY_COMMAND_ID, commandHandler)
  )
}
