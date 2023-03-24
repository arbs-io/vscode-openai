import { workspace, ExtensionContext } from 'vscode'
import { IConfigurationProperties } from '../../interfaces'
import { SecretStorageService } from '..'

export default class ConfigurationService {
  private static _instance: ConfigurationService
  private _configurationProperties: IConfigurationProperties | undefined

  constructor(private context: ExtensionContext) {}

  static init(context: ExtensionContext): void {
    ConfigurationService._instance = new ConfigurationService(context)
  }

  static get instance(): ConfigurationService {
    return ConfigurationService._instance
  }

  async load() {
    const apiKey =
      (await SecretStorageService.instance.getAuthApiKey()) as string

    const ws = workspace.getConfiguration('vscode-openai')
    const baseUrl = ws.get('baseUrl') as string
    const serviceProvider = ws.get('serviceProvider') as string
    const azureDeployment = ws.get('azureDeployment') as string
    const azureApiVersion = ws.get('azureApiVersion') as string
    const defaultModel = ws.get('defaultModel') as string

    if (serviceProvider === 'Azure-OpenAI') {
      this._configurationProperties = {
        serviceProvider: serviceProvider,
        baseUrl: `${baseUrl}`,
        inferenceUrl: `${baseUrl}/deployments/${azureDeployment}`,
        apiKey: apiKey,
        defaultModel: defaultModel,
        requestConfig: {
          headers: { 'api-key': apiKey },
          params: { 'api-version': azureApiVersion },
        },
      }
    } else {
      this._configurationProperties = {
        serviceProvider: serviceProvider,
        baseUrl: baseUrl,
        inferenceUrl: baseUrl,
        apiKey: apiKey,
        defaultModel: defaultModel,
        requestConfig: {},
      }
    }
  }

  async get(): Promise<IConfigurationProperties> {
    if (!this._configurationProperties) {
      await this.load()
    }
    return this._configurationProperties as IConfigurationProperties
  }
}
