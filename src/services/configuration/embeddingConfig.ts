import { createErrorNotification, createInfoNotification } from '@app/apis/node';
import ConfigValue from './utilities/configValue';
import { IConfigurationEmbedding } from '@app/interfaces';

class EmbeddingConfig extends ConfigValue implements IConfigurationEmbedding {
  private static instance: EmbeddingConfig | null = null;

  public static getInstance(): EmbeddingConfig {
    if (!EmbeddingConfig.instance) {
      EmbeddingConfig.instance = new EmbeddingConfig();
    }
    return EmbeddingConfig.instance;
  }

  public get maxCharacterLength(): number {
    return this.getConfigValue<number>(
      'embedding-configuration.max-character-length'
    );
  }

  public get cosineSimilarityThreshold(): number {
    return this.getConfigValue<number>(
      'embedding-configuration.cosine-similarity-threshold'
    );
  }

  public log(): void {
    try {
      const cfgMap = new Map<string, string>();
      cfgMap.set('max_character_length', this.maxCharacterLength.toString());
      cfgMap.set(
        'cosine_similarity_threshold',
        this.cosineSimilarityThreshold.toString()
      );

      createInfoNotification(
        Object.fromEntries(cfgMap),
        'embedding_configuration'
      );
    } catch (error) {
      createErrorNotification(error);
    }
  }
}
export default EmbeddingConfig.getInstance();
