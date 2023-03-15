import { commands, ExtensionContext, Uri, window } from 'vscode'
import { verifyApiKey } from '../openaiUtilities'
import { VSCODE_OPENAI_REGISTER } from './constants'

const OPENAI_APIKEY_LENGTH = 51
const OPENAI_APIKEY_STARTSWITH = 'sk-'

export function registerApiKeyCommand(context: ExtensionContext) {
  _registerApiKeyCommand(context)
}

function _registerApiKeyCommand(context: ExtensionContext) {
  const commandHandler = async (uri: Uri) => {
    await _inputApiKeyOpenAI()
  }
  context.subscriptions.push(
    commands.registerCommand(
      VSCODE_OPENAI_REGISTER.APIKEY_COMMAND_ID,
      commandHandler
    )
  )
}

async function _inputApiKeyOpenAI() {
  const apiKey = await window.showInputBox({
    placeHolder: 'For example: sk-Uzm...MgS3',
    validateInput: (text) => {
      return text.length === OPENAI_APIKEY_LENGTH &&
        text.startsWith(OPENAI_APIKEY_STARTSWITH)
        ? null
        : 'Invalid Api Key'
    },
  })

  if (apiKey !== undefined) {
    await verifyApiKey(apiKey)
  }
}
