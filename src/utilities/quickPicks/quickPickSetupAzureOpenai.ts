import { MultiStepInput, SecretStorageService } from '@app/apis/vscode';
import { SettingConfig as settingCfg } from '@app/services';
import { ExtensionContext } from 'vscode';
import {
  showInputBoxAzureApiKey,
  showInputBoxAzureBaseUrl,
  showQuickPickAzureAuthentication,
  showQuickPickAzureEmbeddingModel,
  showQuickPickAzureInferenceModel,
  showQuickPickAzureScmModel,
} from './commands';
import { IQuickPickSetup } from './interface';

export async function quickPickSetupAzureOpenai(
  _context: ExtensionContext
): Promise<void> {
  async function collectInputs(): Promise<IQuickPickSetup> {
    const state = {} as Partial<IQuickPickSetup>;
    state.serviceProvider = 'Azure-OpenAI';
    state.title = 'Configure Service Provider (openai.azure.com)';
    state.step = 0;
    const steps = [
      (input: MultiStepInput) => showInputBoxAzureBaseUrl(input, state),
      (input: MultiStepInput) => showQuickPickAzureAuthentication(input, state),
      (input: MultiStepInput) => showInputBoxAzureApiKey(input, state),
      (input: MultiStepInput) => showQuickPickAzureInferenceModel(input, state),
      (input: MultiStepInput) => showQuickPickAzureScmModel(input, state),
      (input: MultiStepInput) => showQuickPickAzureEmbeddingModel(input, state),
    ];
    state.totalSteps = steps.length;

    await MultiStepInput.run(async (input) => {
      for (const step of steps) {
        await step(input);
      }
    });

    return state as IQuickPickSetup;
  }

  function cleanQuickPick(label: string) {
    return label.replace(`$(symbol-function)  `, '');
  }

  function getAuthenticationType(label: string): string {

    switch (label) {
      case '$(azure)  Microsoft': {
        return 'oauth2-microsoft-default';
      }
      case '$(azure)  Microsoft Sovereign (US)': {
        return 'oauth2-microsoft-sovereign-us';
      }
      default: {
        return 'api-key';
      }
    }
  }

  //Start openai.com configuration processes
  const state = await collectInputs();

  const inferenceModel = state.modelInference.description as string;
  const inferenceDeploy = cleanQuickPick(state.modelInference.label);
  const authenticationMethod = getAuthenticationType(state.authenticationMethod.label);

  const scmModel = state.modelScm.description as string;
  const scmDeploy = cleanQuickPick(state.modelScm.label);

  let embeddingModel = 'setup-required';
  let embeddingDeploy = 'setup-required';
  if (state.modelEmbedding) {
    embeddingModel = state.modelEmbedding.description as string;
    embeddingDeploy = cleanQuickPick(state.modelEmbedding.label);
  }

  await SecretStorageService.instance.setAuthApiKey(state.authApiKey);
  settingCfg.serviceProvider = state.serviceProvider;
  settingCfg.baseUrl = state.baseUrl;
  settingCfg.defaultModel = inferenceModel;
  settingCfg.azureDeployment = inferenceDeploy;
  settingCfg.scmModel = scmModel;
  settingCfg.scmDeployment = scmDeploy;
  settingCfg.embeddingModel = embeddingModel;
  settingCfg.embeddingsDeployment = embeddingDeploy;
  settingCfg.azureApiVersion = '2024-06-01';
  settingCfg.authenticationMethod = authenticationMethod;
}
