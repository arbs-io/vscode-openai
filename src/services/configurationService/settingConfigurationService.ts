import { extensions, version } from 'vscode'
import * as crypto from 'crypto'
import { SecretStorageService, StatusBarHelper } from '@app/utilities/vscode'
import {
  createErrorNotification,
  createInfoNotification,
  waitFor,
} from '@app/utilities/node'
import { ISettingConfiguration } from '../../interfaces/ISettingConfiguration'
import ConfigurationService from './configurationService'

export default class SettingConfigurationService
  extends ConfigurationService
  implements ISettingConfiguration
{
  private static _instance: SettingConfigurationService

  static init(): void {
    try {
      this._instance = new SettingConfigurationService()
    } catch (error) {
      createErrorNotification(error)
    }
  }
  static get instance(): SettingConfigurationService {
    return this._instance
  }

  static async loadConfigurationService({
    serviceProvider,
    baseUrl,
    defaultModel,
    embeddingModel,
    azureDeployment,
    embeddingsDeployment,
    azureApiVersion,
  }: {
    serviceProvider: string
    baseUrl: string
    defaultModel: string
    embeddingModel: string
    azureDeployment: string
    embeddingsDeployment: string
    azureApiVersion: string
  }) {
    StatusBarHelper.instance.showStatusBarInformation(
      'vscode-openai',
      'update-setting-configuration'
    )
    this.instance.serviceProvider = serviceProvider
    this.instance.baseUrl = baseUrl
    this.instance.defaultModel = defaultModel
    this.instance.embeddingModel = embeddingModel
    this.instance.azureDeployment = azureDeployment
    this.instance.embeddingsDeployment = embeddingsDeployment
    this.instance.azureApiVersion = azureApiVersion
    //Force wait as we need the config to be written
    await waitFor(500, () => false)
    StatusBarHelper.instance.showStatusBarInformation('vscode-openai', '')
  }

  public get serviceProvider(): string {
    return this.getConfigValue<string>('serviceProvider')
  }
  public set serviceProvider(value: string) {
    this.setConfigValue<string>('serviceProvider', value)
  }

  public get baseUrl(): string {
    return this.getConfigValue<string>('baseUrl')
  }
  public set baseUrl(value: string) {
    this.setConfigValue<string>('baseUrl', value)
  }

  public get defaultModel(): string {
    return this.getConfigValue<string>('defaultModel')
  }
  public set defaultModel(value: string) {
    this.setConfigValue<string>('defaultModel', value)
  }

  public get embeddingModel(): string {
    return this.getConfigValue<string>('embeddingModel')
  }
  public set embeddingModel(value: string) {
    this.setConfigValue<string>('embeddingModel', value)
  }

  public get azureDeployment(): string {
    return this.getConfigValue<string>('azureDeployment')
  }
  public set azureDeployment(value: string) {
    this.setConfigValue<string>('azureDeployment', value)
  }

  public get embeddingsDeployment(): string {
    return this.getConfigValue<string>('embeddingsDeployment')
  }
  public set embeddingsDeployment(value: string) {
    this.setConfigValue<string>('embeddingsDeployment', value)
  }

  public get azureApiVersion(): string {
    return this.getConfigValue<string>('azureApiVersion')
  }
  public set azureApiVersion(value: string) {
    this.setConfigValue<string>('azureApiVersion', value)
  }

  public get conversationHistory(): number {
    return this.getConfigValue<number>('conversationHistory')
  }

  // host is used for vscode status bar display only
  public get host(): string {
    if (this.serviceProvider === 'VSCode-OpenAI') return 'vscode-openai'
    return new URL(this.baseUrl).host
  }

  public get inferenceUrl(): string {
    if (this.azureDeployment !== 'setup-required') {
      return `${this.baseUrl}/deployments/${this.azureDeployment}`
    }
    return `${this.baseUrl}`
  }

  public get embeddingUrl(): string {
    if (this.azureDeployment !== 'setup-required') {
      return `${this.baseUrl}/deployments/${this.embeddingsDeployment}`
    }
    return `${this.baseUrl}`
  }

  public async getRequestConfig(): Promise<any> {
    if (this.serviceProvider === 'VSCode-OpenAI') {
      const hash = crypto
        .createHash('sha512')
        .update(`vscode-openai::${this.extensionVersion}`)
        .digest('hex')
      return { headers: { 'vscode-openai': hash } }
    } else if (this.serviceProvider === 'Azure-OpenAI') {
      return {
        headers: {
          'api-key':
            (await SecretStorageService.instance.getAuthApiKey()) as string,
        },
        params: { 'api-version': this.azureApiVersion },
      }
    } else {
      return {}
    }
  }
  public async getApiKey(): Promise<string> {
    return (await SecretStorageService.instance.getAuthApiKey()) as string
  }

  public get extensionVersion(): string {
    const extension = extensions.getExtension(
      'AndrewButson.vscode-openai'
    )?.packageJSON
    return extension.version ? extension.version.toString() : 'beta'
  }

  public static LogConfigurationService(): void {
    try {
      const instance = this._instance
      const cfgMap = new Map<string, string>()

      cfgMap.set('vscode_version', version)
      cfgMap.set('extension_version', instance.extensionVersion)
      cfgMap.set('service_provider', instance.serviceProvider)
      cfgMap.set('host', instance.host)
      cfgMap.set('base_url', instance.baseUrl)
      cfgMap.set('inference_model', instance.defaultModel)
      cfgMap.set('inference_deploy', instance.azureDeployment)
      cfgMap.set('embeddings_model', instance.embeddingModel)
      cfgMap.set('embeddings_deploy', instance.embeddingsDeployment)
      cfgMap.set('az_api_version', instance.azureApiVersion)
      const convHist = instance.conversationHistory.toString()
      cfgMap.set('conversation_history', convHist)

      createInfoNotification(Object.fromEntries(cfgMap), 'configuration')
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
