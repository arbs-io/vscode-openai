export interface IConfigurationSetting {
  serviceProvider: string
  baseUrl: string
  defaultModel: string
  embeddingModel: string
  azureDeployment: string
  embeddingsDeployment: string
  azureApiVersion: string

  host: string
  inferenceUrl: string
  embeddingUrl: string
}
