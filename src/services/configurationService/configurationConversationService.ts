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

  public get temperature(): number {
    return this.getConfigValue<number>('conversation-configuration.temperature')
  }

  public get presencePenalty(): number {
    return this.getConfigValue<number>(
      'conversation-configuration.presence-penalty'
    )
  }

  public get frequencyPenalty(): number {
    return this.getConfigValue<number>(
      'conversation-configuration.frequency-penalty'
    )
  }

  public get numOfAttempts(): number {
    return this.getConfigValue<number>(
      'conversation-configuration.number-of-attempts'
    )
  }

  public get conversationHistory(): number {
    return this.getConfigValue<number>('conversation-configuration.history')
  }

  public static LogConfigurationService(): void {
    try {
      const cfgMap = new Map<string, string>()
      cfgMap.set('temperature', this.instance.temperature.toString())
      cfgMap.set('presence_penalty', this.instance.presencePenalty.toString())
      cfgMap.set('frequency_penalty', this.instance.frequencyPenalty.toString())
      cfgMap.set('number_of_attempts', this.instance.numOfAttempts.toString())
      cfgMap.set(
        'conversation_history',
        this.instance.conversationHistory.toString()
      )

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'conversation_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
