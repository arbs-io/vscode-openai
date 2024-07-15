import OpenAI, { AzureOpenAI } from 'openai'
import {
  ConversationConfig as convCfg,
  SettingConfig as settingCfg,
} from '@app/services'

export async function createOpenAI(
  baseURL: string,
  serviceProvider?: string,
  apiKey?: string
): Promise<OpenAI> {
  const azureApiVersion = settingCfg.azureApiVersion

  apiKey = apiKey ?? (await settingCfg.getApiKey())
  serviceProvider = serviceProvider ?? settingCfg.serviceProvider

  if (serviceProvider == 'Azure-OpenAI') {
    if (apiKey.startsWith('Bearer ')) {
      const token = apiKey.replace('Bearer ', '')
      return new AzureOpenAI({
        azureADTokenProvider: () => Promise.resolve(token),
        apiVersion: azureApiVersion,
        defaultHeaders: { Authorization: apiKey },
        baseURL: baseURL,
        maxRetries: convCfg.numOfAttempts,
      })
    }

    return new AzureOpenAI({
      apiKey: apiKey,
      apiVersion: azureApiVersion,
      baseURL: baseURL,
      maxRetries: convCfg.numOfAttempts,
    })
  }

  return new OpenAI({
    apiKey: apiKey,
    defaultQuery: { 'api-version': azureApiVersion },
    defaultHeaders: { 'api-key': apiKey },
    baseURL: baseURL,
    maxRetries: convCfg.numOfAttempts,
  })
}
