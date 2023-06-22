import { ConfigurationService } from '@app/services'
import { IMessage } from '@app/interfaces'
import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'

let sessionToken = 0
export const LogChatCompletion = (message: IMessage) => {
  try {
    sessionToken = sessionToken + message.totalTokens

    const infoMap = new Map<string, string>()
    const instance = ConfigurationService.instance
    infoMap.set('service_provider', instance.serviceProvider)
    infoMap.set('default_model', instance.defaultModel)
    infoMap.set('tokens_prompt', message.promptTokens.toString())
    infoMap.set('tokens_completion', message.completionTokens.toString())
    infoMap.set('tokens_total', message.totalTokens.toString())
    infoMap.set('tokens_session', sessionToken.toString())

    createInfoNotification(Object.fromEntries(infoMap), 'chat-completion')
  } catch (error) {
    createErrorNotification(error)
  }
}
