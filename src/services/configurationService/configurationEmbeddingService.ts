import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'
import ConfigurationService from './configurationService'
import { IConfigurationEmbedding } from '@app/interfaces'

export default class ConfigurationEmbeddingService
  extends ConfigurationService
  implements IConfigurationEmbedding
{
  private static _instance: ConfigurationEmbeddingService
  static get instance(): ConfigurationEmbeddingService {
    if (!this._instance) {
      try {
        this._instance = new ConfigurationEmbeddingService()
      } catch (error) {
        createErrorNotification(error)
      }
    }
    return this._instance
  }

  public get maxCharacterLength(): number {
    return this.getConfigValue<number>(
      'embedding-configuration.max-character-length'
    )
  }

  public static LogConfigurationService(): void {
    try {
      const cfgMap = new Map<string, string>()
      const convHist = this.instance.maxCharacterLength.toString()
      cfgMap.set('max_character_length', convHist)

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'embedding_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
