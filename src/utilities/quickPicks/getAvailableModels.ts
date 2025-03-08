import { CancellationToken, QuickPickItem } from 'vscode';
import {
  ModelCapability,
  listModelsAzureOpenAI,
  listModelsOpenAI,
} from '@app/apis/openai';

/**
 * This function retrieves available models from Open AI using an API key. It returns a list of QuickPickItems representing each available model.
 * @param openapiAPIKey - The API key used to authenticate with Open AI.
 * @param _token - A cancellation token that can be used to cancel this operation. Not currently implemented in this codebase so defaults to undefined.
 * @returns A list of QuickPickItems representing each available model returned by the API call to Open AI.
 */
export async function getAvailableModelsOpenai(
  apiKey: string,
  baseUrl: string,
  modelCapabiliy: ModelCapability,
  _token?: CancellationToken
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

/**
 * This function retrieves available models from Open AI using an API key. It returns a list of QuickPickItems representing each available model.
 * @param openapiAPIKey - The API key used to authenticate with Open AI.
 * @param token - A cancellation token that can be used to cancel this operation. Not currently implemented in this codebase so defaults to undefined.
 * @returns A list of QuickPickItems representing each available model returned by the API call to Open AI.
 */
export async function getAvailableModelsAzure(
  openapiAPIKey: string,
  openapiBaseUrl: string,
  modelCapabiliy: ModelCapability,
  _token?: CancellationToken
): Promise<QuickPickItem[]> {
  const chatCompletionModels = await listModelsAzureOpenAI(
    openapiAPIKey,
    openapiBaseUrl,
    modelCapabiliy
  );

  const quickPickItems: QuickPickItem[] = [];
  chatCompletionModels?.forEach((deployment) => {
    quickPickItems.push({
      label: `$(symbol-function)  ${deployment.deployment}`,
      description: deployment.model,
    });
  });
  return quickPickItems;
}
