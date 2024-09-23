import { IConfigurationOpenAI } from '@app/interfaces'
import { SettingConfig as settingCfg } from '.'

export enum ChatCompletionModelType {
  INFERENCE,
  SCM,
}

export default class ChatCompletionConfig {
  /**
   * Creates a configuration object for chat completion based on the specified type.
   * @param type The type of model configuration to create ('inference_model' or 'scm_model').
   * @returns The configuration object for the specified type.
   * @throws Will throw an error if the type is not supported.
   */
  static create(type: ChatCompletionModelType): IConfigurationOpenAI {
    // Using a common method to reduce redundancy and improve maintainability.
    const getCommonConfig = () => ({
      azureApiVersion: settingCfg.azureApiVersion,
      apiKey: settingCfg.getApiKey(),
      requestConfig: settingCfg.getRequestConfig(),
    })

    switch (type) {
      case ChatCompletionModelType.INFERENCE:
        return {
          ...getCommonConfig(),
          baseURL: settingCfg.inferenceUrl,
          model: settingCfg.defaultModel,
        }
      case ChatCompletionModelType.SCM:
        return {
          ...getCommonConfig(),
          baseURL: settingCfg.scmUrl,
          model: settingCfg.scmModel,
        }
      default:
        // Providing a more descriptive error message.
        throw new Error(`Unsupported configuration type: ${type}`)
    }
  }
}
