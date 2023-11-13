import { createErrorNotification, createInfoNotification } from '@app/apis/node'
import ConfigurationService from './configurationService'
import { IConfigurationConversationColor } from '@app/types'

export default class ConfigurationConversationColorService
  extends ConfigurationService
  implements IConfigurationConversationColor
{
  private static _instance: ConfigurationConversationColorService
  static get instance(): ConfigurationConversationColorService {
    if (!this._instance) {
      try {
        this._instance = new ConfigurationConversationColorService()
      } catch (error) {
        createErrorNotification(error)
      }
    }
    return this._instance
  }

  public get lightUserColor(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.lightUserColor'
    )
  }

  public get lightUserBackground(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.lightUserBackground'
    )
  }

  public get lightAssistantColor(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.lightAssistantColor'
    )
  }

  public get lightAssistantBackground(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.lightAssistantBackground'
    )
  }

  public get darkUserColor(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.darkUserColor'
    )
  }

  public get darkUserBackground(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.darkUserBackground'
    )
  }

  public get darkAssistantColor(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.darkAssistantColor'
    )
  }

  public get darkAssistantBackground(): string {
    return this.getConfigValue<string>(
      'conversation-configuration.colors.darkAssistantBackground'
    )
  }

  public get getConfigurationConversationColor(): IConfigurationConversationColor {
    const conversationColor: IConfigurationConversationColor = {
      lightUserColor: this.lightUserColor,
      lightUserBackground: this.lightUserBackground,
      lightAssistantColor: this.lightAssistantColor,
      lightAssistantBackground: this.lightAssistantBackground,
      darkUserColor: this.darkUserColor,
      darkUserBackground: this.darkUserBackground,
      darkAssistantColor: this.darkAssistantColor,
      darkAssistantBackground: this.darkAssistantBackground,
    }
    return conversationColor
  }

  public static LogConfigurationService(): void {
    try {
      const cfg = this.instance
      const cfgMap = new Map<string, string>()
      cfgMap.set('lightUserColor', cfg.lightUserColor)
      cfgMap.set('lightUserBackground', cfg.lightUserBackground)
      cfgMap.set('lightAssistantColor', cfg.lightAssistantColor)
      cfgMap.set('lightAssistantBackground', cfg.lightAssistantBackground)
      cfgMap.set('darkUserColor', cfg.darkUserColor)
      cfgMap.set('darkUserBackground', cfg.darkUserBackground)
      cfgMap.set('darkAssistantColor', cfg.darkAssistantColor)
      cfgMap.set('darkAssistantBackground', cfg.darkAssistantBackground)

      createInfoNotification(Object.fromEntries(cfgMap), 'conversation_color')
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
