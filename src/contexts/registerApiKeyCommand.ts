import { commands, ExtensionContext, Uri, window } from 'vscode'
import { verifyApiKey } from '../utilities/openai'
import { SecretStorageService } from '../utilities/vscode'
import { ConfigurationService } from '../services'
import { VSCODE_OPENAI_REGISTER } from './constants'

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
  const apiKey =
    ConfigurationService.instance.serviceProvider === 'Azure-OpenAI'
      ? await _azureApiKey()
      : await _openaiApiKey()

  if (apiKey !== undefined) {
    await SecretStorageService.instance
      .setAuthApiKey(apiKey)
      .then((x) => verifyApiKey())
  }
}

async function _azureApiKey(): Promise<string | undefined> {
  const OPENAI_APIKEY_LENGTH = 32

  return await window.showInputBox({
    title: 'Azure-OpenAI Api-Key',
    placeHolder: 'ed4af062d8567543ad104587ea4505ce',
    validateInput: (text) => {
      return text.length === OPENAI_APIKEY_LENGTH ? null : 'Invalid Api Key'
    },
  })
}

async function _openaiApiKey(): Promise<string | undefined> {
  const OPENAI_APIKEY_LENGTH = 51
  const OPENAI_APIKEY_STARTSWITH = 'sk-'

  return await window.showInputBox({
    title: 'OpenAI Api-Key',
    placeHolder: 'sk-8i6055nAY3eAwARfHFjiT5BlbkFJAEFUvG5GwtAV2RiwP87h',
    validateInput: (text) => {
      return text.length === OPENAI_APIKEY_LENGTH &&
        text.startsWith(OPENAI_APIKEY_STARTSWITH)
        ? null
        : 'Invalid Api Key'
    },
  })
}
