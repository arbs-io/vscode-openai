import { ExtensionContext, SecretStorage } from 'vscode'
import { createErrorNotification } from '@app/utilities/node'

export default class SecretStorageService {
  private static _instance: SecretStorageService

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    try {
      SecretStorageService._instance = new SecretStorageService(context.secrets)
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): SecretStorageService {
    return SecretStorageService._instance
  }

  async setAuthApiKey(token: string): Promise<void> {
    await this.secretStorage.store('openai_apikey', token)
  }

  async getAuthApiKey(): Promise<string | undefined> {
    return await this.secretStorage.get('openai_apikey')
  }
}
