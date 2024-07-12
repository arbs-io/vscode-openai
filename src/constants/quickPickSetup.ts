export const VSCODE_OPENAI_QP_SETUP = {
  PROVIDER_VSCODE: 'vscode-openai',
  PROVIDER_VSCODE_ICON: 'pulse',
  PROVIDER_VSCODE_DESC: '(Sponsored) Use vscode-openai service',

  PROVIDER_OPENAI: 'openai.com',
  PROVIDER_OPENAI_ICON: 'vscode-openai',
  PROVIDER_OPENAI_DESC:
    '(BYOK) Use your own OpenAI subscription (api.openai.com)',

  PROVIDER_AZURE: 'openai.azure.com',
  PROVIDER_AZURE_ICON: 'azure',
  PROVIDER_AZURE_DESC:
    '(BYOK) Use your own Azure OpenAI instance (instance.openai.azure.com)',

  PROVIDER_CUSTOM: 'custom',
  PROVIDER_CUSTOM_ICON: 'server-environment',
  PROVIDER_CUSTOM_DESC:
    '(BYOI) Use your own instance LLM or SLM (openai-api support required)',

  MODEL_CHANGE: 'change models',
  MODEL_CHANGE_ICON: 'symbol-function',
  MODEL_CHANGE_DESC: 'change chat and embedding model',

  CONFIGURATION_RESET: 'reset...',
  CONFIGURATION_RESET_ICON: 'wrench',
  CONFIGURATION_RESET_DESC: 'reset vscode-openai configuration',
}
