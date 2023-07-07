export interface ISettingConfiguration {
  serviceProvider: string
  baseUrl: string
  defaultModel: string
  embeddingModel: string
  azureDeployment: string
  embeddingsDeployment: string
  azureApiVersion: string

  conversationHistory: number
  host: string
  inferenceUrl: string
  embeddingUrl: string
}
