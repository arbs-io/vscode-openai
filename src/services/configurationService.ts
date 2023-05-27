/**
 * ConfigurationService class that handles getting and setting configuration values for the vscode-openai extension.
 */
import { extensions, workspace, version } from 'vscode'
import * as crypto from 'crypto'
import { SecretStorageService, getGitAccessToken } from '@app/utilities/vscode'
import {
  HttpRequest,
  createDebugNotification,
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

export default class ConfigurationService {
  private static _instance: ConfigurationService

  private _githubAccessToken: string | undefined
  private _vscodeopenaiAccessToken: string | undefined

  private readonly VSCODE_OPENAI_BASEURL =
    'https://api.arbs.io/openai/inference/v1'
  private readonly VSCODE_OPENAI_DEPLOYMENTMODEL = 'gpt-35-turbo'
  private readonly VSCODE_OPENAI_APIVERSION = '2023-05-15'
  private readonly VSCODE_OPENAI_CONVERSATION_HISTORY = 4
  private readonly VSCODE_OPENAI_HOST = 'vscode-openai'
  private readonly VSCODE_OPENAI_INFERENCE_URL =
    'https://api.arbs.io/openai/inference/v1/deployments/gpt-35-turbo'
  private readonly VSCODE_OPENAI_TOKEN_URL =
    'https://api.arbs.io/openai/oauth2/token'

  /**
   * Initializes a new instance of the ConfigurationService class.
   */
  static init(): void {
    try {
      ConfigurationService._instance = new ConfigurationService()
    } catch (error) {
      createErrorNotification(error)
    }
  }

  /**
   * Gets the singleton instance of the ConfigurationService class.
   * @returns The singleton instance of the ConfigurationService class.
   */
  static get instance(): ConfigurationService {
    return ConfigurationService._instance
  }

  /**
   * Gets or sets the service provider used by the extension.
   * @returns The service provider used by the extension.
   */
  public get serviceProvider(): string {
    return workspace
      .getConfiguration('vscode-openai')
      .get('serviceProvider') as string
  }
  public set serviceProvider(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'serviceProvider'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
  }

  /**
   * Gets or sets the base URL used by the extension.
   * @returns The base URL used by the extension.
   */
  public get baseUrl(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_BASEURL

    return workspace.getConfiguration('vscode-openai').get('baseUrl') as string
  }
  public set baseUrl(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'baseUrl'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal).then(() => {
      createDebugNotification(`setting base url ${value}`)
    })
  }

  /**
   * Gets or sets the Azure deployment used by the extension.
   * @returns The Azure deployment used by the extension.
   */
  public get azureDeployment(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_DEPLOYMENTMODEL

    return workspace
      .getConfiguration('vscode-openai')
      .get('azureDeployment') as string
  }
  public set azureDeployment(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'azureDeployment'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
  }

  /**
   * Gets or sets the Azure API version used by the extension.
   * @returns The Azure API version used by the extension.
   */
  public get azureApiVersion(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_APIVERSION

    return workspace
      .getConfiguration('vscode-openai')
      .get('azureApiVersion') as string
  }
  public set azureApiVersion(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'azureApiVersion'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
  }

  /**
   * Gets or sets default model for inference requests made to OpenAI API.
   * @returns Default model for inference requests made to OpenAI API.
   */
  public get defaultModel(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_DEPLOYMENTMODEL

    return workspace
      .getConfiguration('vscode-openai')
      .get('defaultModel') as string
  }
  public set defaultModel(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'defaultModel'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
  }

  /**
   * Gets or sets default model for inference requests made to OpenAI API.
   * @returns Default model for inference requests made to OpenAI API.
   */
  public get conversationHistory(): number {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_CONVERSATION_HISTORY

    return workspace
      .getConfiguration('vscode-openai')
      .get('conversationHistory') as number
  }
  public set conversationHistory(value: number) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'conversationHistory'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal)
  }

  // composed properties

  /**
   * Returns host name derived from base URL.
   * @returns Host name derived from base URL.
   */
  public get host(): string {
    if (this.serviceProvider === 'VSCode-OpenAI') return this.VSCODE_OPENAI_HOST

    return new URL(this.baseUrl).host
  }

  /**
   * Returns inference URL based on service provider and base URL.
   * @returns Inference URL based on service provider and base URL.
   */
  public get inferenceUrl(): string {
    if (this.serviceProvider === 'VSCode-OpenAI')
      return this.VSCODE_OPENAI_INFERENCE_URL
    else if (this.serviceProvider === 'Azure-OpenAI') {
      return `${this.baseUrl}/deployments/${this.azureDeployment}`
    } else {
      return `${this.baseUrl}`
    }
  }

  /**
   * Returns request configuration object with headers and parameters based on current configuration settings.
   *@returns Request configuration object with headers and parameters based on current configuration settings.
   */
  public async getRequestConfig(): Promise<any> {
    if (this.serviceProvider === 'VSCode-OpenAI') {
      const hash = crypto
        .createHash('sha512')
        .update('vscode-openai::1.2.1')
        .digest('hex')
      return {
        headers: { 'vscode-openai': hash },
      }
    } else if (this.serviceProvider === 'Azure-OpenAI') {
      return {
        headers: { 'api-key': await this.getApiKey() },
        params: { 'api-version': this.azureApiVersion },
      }
    } else {
      return {}
    }
  }

  /**
   * Returns authentication key for OpenAI API requests.
   *@returns Authentication key for OpenAI API requests.
   */

  public async getApiKey(): Promise<string> {
    if (this.serviceProvider === 'VSCode-OpenAI') {
      // Only auth once
      if (this._vscodeopenaiAccessToken) return this._vscodeopenaiAccessToken

      createDebugNotification(`request github.com access_token`)
      this._githubAccessToken = await getGitAccessToken()
      const request = new HttpRequest(
        'GET',
        `Bearer ${this._githubAccessToken}`,
        this.VSCODE_OPENAI_TOKEN_URL
      )
      createDebugNotification(`request vscode-openai access_token`)
      const resp = await request.send()
      this._vscodeopenaiAccessToken = resp.token as string
      return this._vscodeopenaiAccessToken
    }
    createDebugNotification(`retrieve api-key`)
    return (await SecretStorageService.instance.getAuthApiKey()) as string
  }

  public static LogConfigurationService(): void {
    try {
      const extension = extensions.getExtension(
        'AndrewButson.vscode-openai'
      )?.packageJSON
      const instance = ConfigurationService._instance

      const extConfiguration = new Map<string, string>()
      extConfiguration.set('vscode_version', version)
      extConfiguration.set('extension_version', extension.version)
      extConfiguration.set('openai_service_provider', instance.serviceProvider)
      extConfiguration.set('openai_host', instance.host)
      extConfiguration.set('openai_base_url', instance.baseUrl)
      extConfiguration.set('openai_default_model', instance.defaultModel)
      extConfiguration.set('openai_azure_deployment', instance.azureDeployment)
      extConfiguration.set('openai_azure_api_version', instance.azureApiVersion)
      extConfiguration.set(
        'openai_conversation_history',
        instance.conversationHistory.toString()
      )
      createInfoNotification(
        Object.fromEntries(extConfiguration),
        'configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
