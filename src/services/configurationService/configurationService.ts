import { extensions, workspace, version } from 'vscode'
import * as crypto from 'crypto'
import { SecretStorageService, getGitAccessToken } from '@app/utilities/vscode'
import {
  HttpRequest,
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'
import { IConfigurationService } from './IConfigurationService'

export default class ConfigurationService implements IConfigurationService {
  private static _instance: ConfigurationService
  private _githubAccessToken: string | undefined
  private _vscodeopenaiAccessToken: string | undefined

  static init(): void {
    try {
      this._instance = new ConfigurationService()
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): ConfigurationService {
    return this._instance
  }

  static loadConfigurationService(config: IConfigurationService) {
    this._instance.serviceProvider = config.serviceProvider
    this._instance.baseUrl = config.baseUrl
    this._instance.defaultModel = config.defaultModel
    this._instance.embeddingModel = config.embeddingModel
    this._instance.azureDeployment = config.azureDeployment
    this._instance.embeddingsDeployment = config.embeddingsDeployment
    this._instance.azureApiVersion = config.azureApiVersion
  }

  private getConfigValue<T>(configName: string): T {
    const ws = workspace.getConfiguration('vscode-openai')
    return ws.get(configName) as T
  }

  private setConfigValue<T>(configName: string, value: T): void {
    const ws = workspace.getConfiguration('vscode-openai')
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
      .then(() => {
        createDebugNotification(`setting ${configName} ${value}`)
      })
      .then(undefined, (err) => {
        createErrorNotification(`${err}`)
      })
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

  public get conversationHistory(): number {
    return this.getConfigValue<number>('conversationHistory')
  }
  // public set conversationHistory(value: number) {
  //   this.setConfigValue<number>('conversationHistory', value)
  // }

  /*
















  CALCULATED PROPERTY




  */

  public get host(): string {
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
        headers: { 'api-key': await this.getApiKey() },
        params: { 'api-version': this.azureApiVersion },
      }
    } else {
      return {}
    }
  }

  public async getApiKey(): Promise<string> {
    if (this.serviceProvider === 'VSCode-OpenAI') {
      // Only auth once
      if (this._vscodeopenaiAccessToken) return this._vscodeopenaiAccessToken
      createDebugNotification(`request github.com access_token`)
      this._githubAccessToken = await getGitAccessToken()
      const request = new HttpRequest(
        'GET',
        `Bearer ${this._githubAccessToken}`,
        'https://api.arbs.io/openai/oauth2/token'
      )
      createDebugNotification(`request vscode-openai access_token`)
      const resp = await request.send()
      this._vscodeopenaiAccessToken = resp.token as string
      return this._vscodeopenaiAccessToken
    }
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
