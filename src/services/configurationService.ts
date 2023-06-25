import { extensions, workspace, version } from 'vscode'
import * as crypto from 'crypto'
import { SecretStorageService, getGitAccessToken } from '@app/utilities/vscode'
import {
  HttpRequest,
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

const CONFIG_CONSTANTS = {
  BASE_URL: 'https://api.arbs.io/openai/inference/v1',
  DEPLOYMENT_MODEL: 'gpt-35-turbo',
  EMBEDDING_DEPLOYMENT_MODEL: 'text-embedding-ada-002',
  API_VERSION: '2023-05-15',
  CONVERSATION_HISTORY: 4,
  HOST: 'vscode-openai',
  INFERENCE_URL:
    'https://api.arbs.io/openai/inference/v1/deployments/gpt-35-turbo',
  EMBEDDING_URL:
    'https://api.arbs.io/openai/inference/v1/deployments/text-embedding-ada-002',
  TOKEN_URL: 'https://api.arbs.io/openai/oauth2/token',
}

export default class ConfigurationService {
  private static _instance: ConfigurationService
  private _githubAccessToken: string | undefined
  private _vscodeopenaiAccessToken: string | undefined

  static init(): void {
    try {
      ConfigurationService._instance = new ConfigurationService()
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): ConfigurationService {
    return ConfigurationService._instance
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
        // createDebugNotification(`setting ${configName} ${value}`)
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
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.BASE_URL

    return this.getConfigValue<string>('baseUrl')
  }
  public set baseUrl(value: string) {
    this.setConfigValue<string>('baseUrl', value)
  }

  public get azureDeployment(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.DEPLOYMENT_MODEL

    return this.getConfigValue<string>('azureDeployment')
  }

  public set azureDeployment(value: string) {
    this.setConfigValue<string>('azureDeployment', value)
  }

  public get embeddingsDeployment(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.EMBEDDING_DEPLOYMENT_MODEL

    return this.getConfigValue<string>('embeddingsDeployment')
  }

  public set embeddingsDeployment(value: string) {
    this.setConfigValue<string>('embeddingsDeployment', value)
  }

  public get azureApiVersion(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.API_VERSION

    return this.getConfigValue<string>('azureApiVersion')
  }

  public set azureApiVersion(value: string) {
    this.setConfigValue<string>('azureApiVersion', value)
  }

  public get defaultModel(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.DEPLOYMENT_MODEL

    return this.getConfigValue<string>('defaultModel')
  }

  public set defaultModel(value: string) {
    this.setConfigValue<string>('defaultModel', value)
  }

  public get embeddingModel(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.DEPLOYMENT_MODEL

    return this.getConfigValue<string>('embeddingModel')
  }

  public set embeddingModel(value: string) {
    this.setConfigValue<string>('embeddingModel', value)
  }

  public get conversationHistory(): number {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.CONVERSATION_HISTORY

    return this.getConfigValue<number>('conversationHistory')
  }

  public set conversationHistory(value: number) {
    this.setConfigValue<number>('conversationHistory', value)
  }

  public get host(): string {
    if (this.serviceProvider === 'VSCode-OpenAI') return CONFIG_CONSTANTS.HOST

    return new URL(this.baseUrl).host
  }

  public get inferenceUrl(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.INFERENCE_URL
    else if (this.serviceProvider === 'Azure-OpenAI') {
      return `${this.baseUrl}/deployments/${this.azureDeployment}`
    } else {
      return `${this.baseUrl}`
    }
  }

  public get embeddingUrl(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return CONFIG_CONSTANTS.EMBEDDING_URL
    else if (this.serviceProvider === 'Azure-OpenAI') {
      return `${this.baseUrl}/deployments/${this.azureDeployment}`
    } else {
      return `${this.baseUrl}`
    }
  }

  public async getRequestConfig(): Promise<any> {
    const extensionVersion = ConfigurationService.instance.extensionVersion

    if (this.serviceProvider === 'VSCode-OpenAI') {
      const hash = crypto
        .createHash('sha512')
        .update(`vscode-openai::${extensionVersion}`)
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
        CONFIG_CONSTANTS.TOKEN_URL
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
      const instance = ConfigurationService.instance
      const extConfiguration = new Map<string, string>()
      extConfiguration.set('vscode_version', version)
      extConfiguration.set('extension_version', instance.extensionVersion)
      extConfiguration.set('service_provider', instance.serviceProvider)
      extConfiguration.set('host', instance.host)
      extConfiguration.set('base_url', instance.baseUrl)
      extConfiguration.set('model_chat_completion', instance.defaultModel)
      extConfiguration.set('model_embeddings', instance.embeddingModel)
      extConfiguration.set('az_inference', instance.azureDeployment)
      extConfiguration.set('az_embedding', instance.embeddingsDeployment)
      extConfiguration.set('az_api_version', instance.azureApiVersion)
      const convHist = instance.conversationHistory.toString()
      extConfiguration.set('conversation_history', convHist)
      createInfoNotification(
        Object.fromEntries(extConfiguration),
        'configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
