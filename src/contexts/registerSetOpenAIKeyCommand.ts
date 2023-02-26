import { commands, ExtensionContext, Uri, window } from 'vscode'
import SecretStorageService from '../services/secretStorageService'
import { OPENAI_UPDATE_APIKEY_COMMAND_ID } from './openaiCommands'

const OPENAI_APIKEY_LENGTH = 51
const OPENAI_APIKEY_STARTSWITH = 'sk-'

export function registerSetOpenAIKeyCommand(context: ExtensionContext) {
  _registerApiKeyCommand(context)
}
function _registerApiKeyCommand(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    const apiKey = await _inputApiKeyOpenAI()
    window.showInformationMessage(`Setting ApiKey: ${apiKey}`)
  }
  context.subscriptions.push(
    commands.registerCommand(OPENAI_UPDATE_APIKEY_COMMAND_ID, commandHandler)
  )
}

async function _inputApiKeyOpenAI(): Promise<boolean> {
  const result = await window.showInputBox({
    placeHolder: 'For example: sk-Uzm...MgS3',
    validateInput: (text) => {
      window.showInformationMessage(`Validating: ${text}`)
      return text.length === OPENAI_APIKEY_LENGTH &&
        text.startsWith(OPENAI_APIKEY_STARTSWITH)
        ? null
        : 'Invalid Api Key'
    },
  })

  if (result !== undefined) {
    window.showInformationMessage(`SecretStorageService Api Key: ${result}`)
    SecretStorageService.instance.setAuthApiKey(result)
    return true
  }
  window.showWarningMessage(`OpenAI Api Key has not been set`)
  return false
}
