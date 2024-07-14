import { ExtensionContext, SecretStorage } from 'vscode'
import { createErrorNotification } from '@app/apis/node'
import {
  getAzureOpenAIAccessToken,
  getVscodeOpenAccessToken,
} from '@app/apis/vscode'
import { SettingConfig as settingCfg } from '@app/services'

export default class SecretStorageService {
  private static _instance: SecretStorageService

  private constructor(private secretStorage: SecretStorage) {} // Made the constructor private to enforce singleton pattern

  static init(context: ExtensionContext): void {
    try {
      if (!SecretStorageService._instance) {
        SecretStorageService._instance = new SecretStorageService(
          context.secrets
        )
      } else {
        throw new Error('SecretStorageService already initialized')
      }
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): SecretStorageService {
    if (!SecretStorageService._instance) {
      throw new Error('SecretStorageService not initialized')
    }
    return SecretStorageService._instance
  }

  async setAuthApiKey(token: string): Promise<void> {
    await this.secretStorage.store('openai_apikey', token)
  }

  async getAuthApiKey(): Promise<string | undefined> {
    try {
      let authApiKey = await this.secretStorage.get('openai_apikey')
      switch (settingCfg.serviceProvider) {
        case 'Azure-OpenAI':
          if (authApiKey?.startsWith('Bearer')) {
            const accessToken = await getAzureOpenAIAccessToken()
            authApiKey = `Bearer ${accessToken}`
          }
          break

        case 'OpenAI':
          break

        case 'Custom-OpenAI':
          break

        case 'VSCode-OpenAI':
          break

        default:
          break
      }
      return authApiKey
    } catch (error) {
      createErrorNotification(error)
      return undefined
    }
  }
}
