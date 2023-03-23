import { commands, workspace } from 'vscode'
import { Configuration, OpenAIApi } from 'openai'
import { getRequestConfig } from './getRequestConfig'
import {
  ExtensionStatusBarItem,
  SecretStorageService,
} from '../../vscodeUtilities'

export async function validateApiKey() {
  const apiKey = await SecretStorageService.instance.getAuthApiKey()
  if (apiKey !== undefined && apiKey !== '<invalid-key>') {
    ExtensionStatusBarItem.instance.showStatusBarInformation(
      'loading~spin',
      'OpenAI: Connecting'
    )
    verifyApiKey(apiKey)
  } else {
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    ExtensionStatusBarItem.instance.showStatusBarError(
      'lock',
      'OpenAI: Invalid Api-Key'
    )
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
    const response = await openai.listModels(getRequestConfig(apiKey))
    if (response.status === 200) {
      SecretStorageService.instance.setAuthApiKey(apiKey)
      commands.executeCommand(
        'setContext',
        'vscode-openai.context.apikey',
        true
      )
      ExtensionStatusBarItem.instance.showStatusBarInformation(
        'unlock',
        'OpenAI'
      )
      return true
    }
  } catch (error: any) {
    SecretStorageService.instance.setAuthApiKey('<invalid-key>')
    const apiKey = await SecretStorageService.instance.getAuthApiKey()
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
  }
  ExtensionStatusBarItem.instance.showStatusBarError(
    'lock',
    'OpenAI: Invalid Api-Key'
  )
  return false
}
