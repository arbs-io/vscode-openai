import { workspace } from 'vscode'

export function getRequestConfig(apiKey: string): IOpenAIConfig {
  const ws = workspace.getConfiguration('vscode-openai')
  const baseUrl = ws.get('baseUrl') as string
  const serviceProvider = ws.get('serviceProvider') as string
  const azureDeployment = ws.get('azureDeployment') as string
  const azureApiVersion = ws.get('azureApiVersion') as string

  if (serviceProvider === 'Azure-OpenAI') {
    const providerConfig: IOpenAIConfig = {
      baseUrl: `${baseUrl}`,
      inferenceUrl: `${baseUrl}/deployments/${azureDeployment}`,
      apiKey: apiKey,
      requestConfig: {
        headers: { 'api-key': apiKey },
        params: { 'api-version': azureApiVersion },
      },
    }
    return providerConfig
  } else {
    const providerConfig: IOpenAIConfig = {
      baseUrl: baseUrl,
      inferenceUrl: baseUrl,
      apiKey: apiKey,
      requestConfig: {},
    }
    return providerConfig
  }
}

export interface IOpenAIConfig {
  baseUrl: string
  inferenceUrl: string
  apiKey: string
  requestConfig: any
}
