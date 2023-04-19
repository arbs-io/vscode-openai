/**
 * ConfigurationService class that handles getting and setting configuration values for the vscode-openai extension.
 */
import { workspace } from 'vscode'
import { SecretStorageService } from '@app/utilities/vscode'

export default class ConfigurationService {
  private static _instance: ConfigurationService

  /**
   * Initializes a new instance of the ConfigurationService class.
   */
  static init(): void {
    ConfigurationService._instance = new ConfigurationService()
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
    return workspace.getConfiguration('vscode-openai').get('baseUrl') as string
  }
  public set baseUrl(value: string) {
    const ws = workspace.getConfiguration('vscode-openai')
    const configName = 'baseUrl'
    const setAsGlobal = ws.inspect(configName)?.workspaceValue == undefined
    ws.update(configName, value, setAsGlobal).then(() => {
      console.log(value)
    })
  }

  /**
   * Gets or sets the Azure deployment used by the extension.
   * @returns The Azure deployment used by the extension.
   */
  public get azureDeployment(): string {
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
    return new URL(this.baseUrl).host
  }

  /**
   * Returns inference URL based on service provider and base URL.
   * @returns Inference URL based on service provider and base URL.
   */
  public get inferenceUrl(): string {
    if (this.serviceProvider === 'Azure-OpenAI') {
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
    if (this.serviceProvider === 'Azure-OpenAI') {
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
    return (await SecretStorageService.instance.getAuthApiKey()) as string
  }
}
