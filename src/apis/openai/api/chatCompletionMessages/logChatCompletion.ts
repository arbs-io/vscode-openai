import { ConfigurationSettingService } from '@app/services'
import { IMessage } from '@app/types'
import { createErrorNotification, createInfoNotification } from '@app/apis/node'

let sessionToken = 0
export const LogChatCompletion = (message: IMessage) => {
  try {
    sessionToken = sessionToken + message.totalTokens

    const infoMap = new Map<string, string>()
    infoMap.set('service_provider', ConfigurationSettingService.serviceProvider)
    infoMap.set('default_model', ConfigurationSettingService.defaultModel)
    infoMap.set('tokens_prompt', message.promptTokens.toString())
    infoMap.set('tokens_completion', message.completionTokens.toString())
    infoMap.set('tokens_total', message.totalTokens.toString())
    infoMap.set('tokens_session', sessionToken.toString())

    createInfoNotification(Object.fromEntries(infoMap), 'chat-completion')
  } catch (error) {
    createErrorNotification(error)
  }
}
