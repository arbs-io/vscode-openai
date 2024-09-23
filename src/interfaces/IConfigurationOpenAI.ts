export interface IConfigurationOpenAI {
  azureApiVersion: string
  apiKey: Promise<string>
  baseURL: string
  model: string
  requestConfig: any
}
