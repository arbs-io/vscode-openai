import { workspace, WorkspaceConfiguration } from 'vscode'
import { SecretStorageService } from '..'

export default class ConfigurationService {
  private static _instance: ConfigurationService

  static init(): void {
    ConfigurationService._instance = new ConfigurationService()
  }

  static get instance(): ConfigurationService {
    return ConfigurationService._instance
  }

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

  // composed properties
  public get host(): string {
    return new URL(this.baseUrl).host
  }

  public get inferenceUrl(): string {
    if (this.serviceProvider === 'Azure-OpenAI') {
      return `${this.baseUrl}/deployments/${this.azureDeployment}`
    } else {
      return `${this.baseUrl}`
    }
  }

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

  public async getApiKey(): Promise<string> {
    return (await SecretStorageService.instance.getAuthApiKey()) as string
  }
}
