import { createErrorNotification } from '@app/apis/node';
import { getAzureOpenAIAccessToken, getAzureOpenAIAccessTokenSovereignUs } from '@app/apis/vscode';
import { SettingConfig } from '@app/services';
import { ExtensionContext, SecretStorage } from 'vscode';

export default class SecretStorageService {
  private static _instance: SecretStorageService;

  private constructor(private secretStorage: SecretStorage) { } // Made the constructor private to enforce singleton pattern

  static init(context: ExtensionContext): void {
    try {
      if (!SecretStorageService._instance) {
        SecretStorageService._instance = new SecretStorageService(
          context.secrets
        );
      } else {
        throw new Error('SecretStorageService already initialized');
      }
    } catch (error) {
      createErrorNotification(error);
    }
  }

  static get instance(): SecretStorageService {
    if (!SecretStorageService._instance) {
      throw new Error('SecretStorageService not initialized');
    }
    return SecretStorageService._instance;
  }

  async setAuthApiKey(token: string): Promise<void> {
    await this.secretStorage.store('openai_apikey', token);
  }

  async getAuthApiKey(): Promise<string | undefined> {
    try {
      let authApiKey = await this.secretStorage.get('openai_apikey');
      switch (SettingConfig.serviceProvider) {
        case 'Azure-OpenAI': {

          switch (SettingConfig.authenticationMethod) {
            case 'oauth2-microsoft-default': {
              const accessToken = await getAzureOpenAIAccessToken();
              authApiKey = `Bearer ${accessToken}`;
              break;
            }
            case 'oauth2-microsoft-sovereign-us': {
              const accessToken = await getAzureOpenAIAccessTokenSovereignUs();
              authApiKey = `Bearer ${accessToken}`;
              break;
            }
          }
          break;
        }

        case 'OpenAI':
          break;

        case 'Custom-OpenAI':
          break;

        case 'VSCode-OpenAI':
          break;

        default:
          break;
      }
      return authApiKey;
    } catch (error) {
      createErrorNotification(error);
      return undefined;
    }
  }
}
