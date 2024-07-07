import { IChatCompletionConfig } from '@app/interfaces'
import { SettingConfig } from '.'

export default class ChatCompletionConfigFactory {
  /**
   * Creates a configuration object for chat completion based on the specified type.
   * @param type The type of model configuration to create ('inference_model' or 'scm_model').
   * @returns The configuration object for the specified type.
   * @throws Will throw an error if the type is not supported.
   */
  static createConfig(
    type: 'inference_model' | 'scm_model'
  ): IChatCompletionConfig {
    // Using a common method to reduce redundancy and improve maintainability.
    const getCommonConfig = () => ({
      azureApiVersion: SettingConfig.azureApiVersion,
      apiKey: SettingConfig.getApiKey(),
      requestConfig: SettingConfig.getRequestConfig(),
    })

    switch (type) {
      case 'inference_model':
        return {
          ...getCommonConfig(),
          baseURL: SettingConfig.inferenceUrl,
          model: SettingConfig.defaultModel,
        }
      case 'scm_model':
        return {
          ...getCommonConfig(),
          baseURL: SettingConfig.scmUrl,
          model: SettingConfig.scmModel,
        }
      default:
        // Providing a more descriptive error message.
        throw new Error(`Unsupported configuration type: ${type}`)
    }
  }
}
