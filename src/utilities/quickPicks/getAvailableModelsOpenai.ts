import {
  ModelCapability,
  listModelsOpenAI
} from '@app/apis/openai';
import { QuickPickItem } from 'vscode';

/**
 * This function retrieves available models from Open AI using an API key. It returns a list of QuickPickItems representing each available model.
 * @param openapiAPIKey - The API key used to authenticate with Open AI.
 * @param _token - A cancellation token that can be used to cancel this operation. Not currently implemented in this codebase so defaults to undefined.
 * @returns A list of QuickPickItems representing each available model returned by the API call to Open AI.
 */
export async function getAvailableModelsOpenai(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapability
): Promise<QuickPickItem[]> {
  const chatCompletionModels = await listModelsOpenAI(
    apiKey,
    baseUrl,
    modelCapabiliy
  );

  // Map each returned label into a QuickPickItem object with label property set as label value returned by API call.
  return chatCompletionModels.map((label) => ({
    label: `$(symbol-function)  ${label}`,
  }));
}
