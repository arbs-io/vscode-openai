import { createErrorNotification, createInfoNotification } from '@app/apis/node'
import ConfigurationService from './configurationService'
import { IConfigurationConversation } from '@app/types'

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

  public get topP(): number {
    return this.getConfigValue<number>('conversation-configuration.top-p')
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

  public get summaryMaxLength(): number {
    return this.getConfigValue<number>(
      'conversation-configuration.summary-max-length'
    )
  }

  public get summaryThreshold(): number {
    return this.getConfigValue<number>(
      'conversation-configuration.summary-threshold'
    )
  }

  public get messageShortcuts(): boolean {
    return this.getConfigValue<boolean>(
      'conversation-configuration.message-shortcuts'
    )
  }

  public get assistantRules(): boolean {
    return this.getConfigValue<boolean>(
      'conversation-configuration.assistant-rules'
    )
  }

  public static LogConfigurationService(): void {
    try {
      const cfg = this.instance
      const cfgMap = new Map<string, string>()
      cfgMap.set('temperature', cfg.temperature.toString())
      cfgMap.set('presence_penalty', cfg.presencePenalty.toString())
      cfgMap.set('top_p', cfg.topP.toString())
      cfgMap.set('frequency_penalty', cfg.frequencyPenalty.toString())
      cfgMap.set('number_of_attempts', cfg.numOfAttempts.toString())
      cfgMap.set('conversation_history', cfg.conversationHistory.toString())
      cfgMap.set('summary_max_length', cfg.summaryMaxLength.toString())
      cfgMap.set('summary_threshold', cfg.summaryThreshold.toString())

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'conversation_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
