import {
  createErrorNotification,
  createInfoNotification,
} from '@app/utilities/node'
import ConfigurationService from './configurationService'
import { IConfigurationEmbedding } from '@app/types'

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

  public get cosineSimilarityThreshold(): number {
    return this.getConfigValue<number>(
      'embedding-configuration.cosine-similarity-threshold'
    )
  }

  public static LogConfigurationService(): void {
    try {
      const cfgMap = new Map<string, string>()
      cfgMap.set(
        'max_character_length',
        this.instance.maxCharacterLength.toString()
      )
      cfgMap.set(
        'cosine_similarity_threshold',
        this.instance.cosineSimilarityThreshold.toString()
      )

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'embedding_configuration'
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }
}
