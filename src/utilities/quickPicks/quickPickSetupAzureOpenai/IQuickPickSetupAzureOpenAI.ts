import { QuickPickItem } from 'vscode'

export interface IQuickPickSetupAzureOpenAI {
  title: string
  step: number
  totalSteps: number
  openaiBaseUrl: string
  authType: QuickPickItem
  openaiApiKey: string
  quickPickInferenceModel: QuickPickItem
  quickPickScmModel: QuickPickItem
  quickPickEmbeddingModel: QuickPickItem
}
