import { ExtensionContext, SecretStorage } from 'vscode'

export default class SecretStorageService {
  private static _instance: SecretStorageService

  constructor(private secretStorage: SecretStorage) {}

  static init(context: ExtensionContext): void {
    SecretStorageService._instance = new SecretStorageService(context.secrets)
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
