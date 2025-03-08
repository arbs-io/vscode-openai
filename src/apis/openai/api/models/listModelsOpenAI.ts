import { SettingConfig as settingCfg } from '@app/services';
import { createOpenAI, errorHandler, ModelCapability } from '@app/apis/openai';

export async function listModelsOpenAI(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapability
): Promise<Array<string>> {
  const models = new Array<string>();
  try {
    const openai = await createOpenAI(baseUrl, 'OpenAI', apiKey);
    const headers = settingCfg.apiHeaders;
    const response = await openai.models.list({
      headers: { ...headers },
    });

    const isChatCompletionModel = (model: any): boolean => {
      return (
        modelCapabiliy === ModelCapability.ChatCompletion &&
        (model.id.includes('gpt') || model.id.startsWith('o'))
      );
    };

    const isEmbeddingModel = (model: any): boolean => {
      return (
        modelCapabiliy === ModelCapability.Embedding &&
        model.id.includes('embedding')
      );
    };

    response.data.forEach((model: any) => {
      if (isChatCompletionModel(model) || isEmbeddingModel(model)) {
        models.push(model.id);
      }
    });

    return models.sort((a, b) => b.localeCompare(a));
  } catch (error: any) {
    errorHandler(error);
  }
  return models;
}
