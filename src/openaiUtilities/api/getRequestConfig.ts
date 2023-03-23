import { workspace } from 'vscode'
import { IOpenAIConfig } from '../../interfaces'
import { SecretStorageService } from '../../vscodeUtilities'

export async function getRequestConfig(): Promise<IOpenAIConfig> {
  const apiKey = (await SecretStorageService.instance.getAuthApiKey()) as string

  const ws = workspace.getConfiguration('vscode-openai')
  const baseUrl = ws.get('baseUrl') as string
  const serviceProvider = ws.get('serviceProvider') as string
  const azureDeployment = ws.get('azureDeployment') as string
  const azureApiVersion = ws.get('azureApiVersion') as string
  const defaultModel = ws.get('defaultModel') as string

  if (serviceProvider === 'Azure-OpenAI') {
    const providerConfig: IOpenAIConfig = {
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
    return providerConfig
  } else {
    const providerConfig: IOpenAIConfig = {
      serviceProvider: serviceProvider,
      baseUrl: baseUrl,
      inferenceUrl: baseUrl,
      apiKey: apiKey,
      defaultModel: defaultModel,
      requestConfig: {},
    }
    return providerConfig
  }
}
