import { createErrorNotification, createInfoNotification } from '@app/apis/node'
import ConfigurationService from './configurationService'
import { IConfigurationConversation } from '@app/interfaces'

class ConversationConfig
  extends ConfigurationService
  implements IConfigurationConversation
{
  private static instance: ConversationConfig | null = null

  public static getInstance(): ConversationConfig {
    if (!ConversationConfig.instance) {
      ConversationConfig.instance = new ConversationConfig()
    }
    return ConversationConfig.instance
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

  public get maxTokens(): number | undefined {
    const value = this.getConfigValue<number>(
      'conversation-configuration.max-tokens'
    )
    return value !== 0 ? value : undefined
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

  public log(): void {
    try {
      const cfgMap = new Map<string, string>()
      cfgMap.set('temperature', this.temperature.toString())
      cfgMap.set('presence_penalty', this.presencePenalty.toString())
      cfgMap.set('top_p', this.topP.toString())
      cfgMap.set('max_tokens', this.maxTokens?.toString() ?? 'maximum')
      cfgMap.set('frequency_penalty', this.frequencyPenalty.toString())
      cfgMap.set('number_of_attempts', this.numOfAttempts.toString())
      cfgMap.set('conversation_history', this.conversationHistory.toString())
      cfgMap.set('summary_max_length', this.summaryMaxLength.toString())
      cfgMap.set('summary_threshold', this.summaryThreshold.toString())

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'conversation_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
export default ConversationConfig.getInstance()
