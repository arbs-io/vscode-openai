import { window } from 'vscode'
import { verifyApiKey } from '../../openai'
import { SecretStorageService } from '..'

export async function quickPickOpenAI() {
  const apiKey = await _openaiApiKey()

  if (apiKey !== undefined) {
    await SecretStorageService.instance
      .setAuthApiKey(apiKey)
      .then((x) => verifyApiKey())
  }
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
