import { SettingConfig as settingCfg, featureVerifyApiKey } from '@app/services';
import { StatusBarServiceProvider, setFeatureFlag } from '@app/apis/vscode';
import { VSCODE_OPENAI_EXTENSION } from '@app/constants';
import { createErrorNotification, createInfoNotification } from '@app/apis/node';
import { createOpenAI, errorHandler } from '@app/apis/openai';

export async function validateApiKey() {
  try {
    await verifyApiKey();
  } catch (error) {
    createErrorNotification(error);
  }
}

export async function verifyApiKey(): Promise<boolean> {
  try {
    if (!featureVerifyApiKey()) {return true;}

    StatusBarServiceProvider.instance.showStatusBarInformation(
      'loading~spin',
      '- verify authentication'
    );

    const openai = await createOpenAI(settingCfg.baseUrl);
    await openai.models.list(await settingCfg.getRequestConfig());

    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, true);
    createInfoNotification('verifyApiKey success');
    StatusBarServiceProvider.instance.showStatusBarInformation(
      'vscode-openai',
      ''
    );
    return true;
  } catch (error: any) {
    errorHandler(error);
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false);
  }
  return false;
}
