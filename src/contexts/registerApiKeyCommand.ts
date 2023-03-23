import { commands, ExtensionContext, Uri, window, workspace } from 'vscode'
import { verifyApiKey } from '../openaiUtilities'
import { VSCODE_OPENAI_REGISTER } from './constants'

const OPENAI_APIKEY_LENGTH = 51
const OPENAI_APIKEY_STARTSWITH = 'sk-'
const AZURE_OPENAI_APIKEY_LENGTH = 32

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
  const ws = workspace.getConfiguration('vscode-openai')
  const authentication = ws.get('authentication') as string

  const apiKey = await window.showInputBox({
    title: 'OpenAI Api-Key',
    placeHolder: 'For example: sk-Uzm...MgS3',
    validateInput: (text) => {
      if (authentication === 'OpenAI (ApiKey)') {
        return text.length === OPENAI_APIKEY_LENGTH &&
          text.startsWith(OPENAI_APIKEY_STARTSWITH)
          ? null
          : 'Invalid Api Key'
      } else {
        return text.length === AZURE_OPENAI_APIKEY_LENGTH
          ? null
          : 'Invalid Api Key'
      }
    },
  })

  if (apiKey !== undefined) {
    await verifyApiKey(apiKey)
  }
}
