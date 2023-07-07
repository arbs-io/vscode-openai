import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'
import ConfigurationService from './configurationService'
import { IConfigurationConversation } from '@app/interfaces'

export default class ConfigurationConversationService
  extends ConfigurationService
  implements IConfigurationConversation
{
  private static _instance: ConfigurationConversationService
  static get instance(): ConfigurationConversationService {
    if (!this._instance) {
      try {
        this._instance = new ConfigurationConversationService()
      } catch (error) {
        createErrorNotification(error)
      }
    }
    return this._instance
  }

  public get conversationHistory(): number {
    return this.getConfigValue<number>('conversation-configuration.history')
  }

  public static LogConfigurationService(): void {
    try {
      const cfgMap = new Map<string, string>()
      const convHist = this.instance.conversationHistory.toString()
      cfgMap.set('conversation_history', convHist)

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'conversation_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
