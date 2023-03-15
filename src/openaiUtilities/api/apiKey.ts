import { commands, window, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import {
  ExtensionStatusBarItem,
  SecretStorageService,
} from '../../vscodeUtilities'

export async function validateApiKey() {
  const apiKey = await SecretStorageService.instance.getAuthApiKey()
  if (apiKey !== undefined && apiKey !== '<invalid-key>') {
    ExtensionStatusBarItem.instance.setText(
      'loading~spin',
      'openai: establishing link'
    )
    verifyApiKey(apiKey)
  } else {
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    ExtensionStatusBarItem.instance.setText('lock', 'openai: invalid api-key')
  }
}

export async function verifyApiKey(apiKey: string): Promise<boolean> {
  try {
    const ws = workspace.getConfiguration('vscode-openai')
    const baseurl = ws.get('baseurl') as string

    const configuration = new Configuration({
      apiKey: apiKey,
      basePath: baseurl,
    })
    const openai = new OpenAIApi(configuration)
    const response = await openai.listModels()
    if (response.status === 200) {
      SecretStorageService.instance.setAuthApiKey(apiKey)
      commands.executeCommand(
        'setContext',
        'vscode-openai.context.apikey',
        true
      )
      ExtensionStatusBarItem.instance.setText('key', 'openai: ready')
      return true
    }
  } catch (error: any) {
    SecretStorageService.instance.setAuthApiKey('<invalid-key>')
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
  }
  ExtensionStatusBarItem.instance.setText('lock', 'openai: invalid api-key')
  return false
}
