export const VSCODE_OPENAI_EXTENSION = {
  INSTRUMENTATION_KEY: 'e01c0a97-9930-4885-b2e8-772176ced488',
  ENABLED_COMMAND_ID: 'vscode-openai.extension.enabled',
}

export const VSCODE_OPENAI_EMBEDDING = {
  ENABLED_COMMAND_ID: 'vscode-openai.embedding.enabled',
  SETUP_REQUIRED_COMMAND_ID: 'vscode-openai.embedding.setup-required',
  RESOURCE_QUERY_ALL: '057c0000-0000-0000-0000-000000000000',
  STORAGE_V1_ID: 'embedding.v1',
  STORAGE_V2_ID: 'embedding.v2',
}

export const VSCODE_OPENAI_CONVERSATION = {
  STORAGE_V1_ID: 'conversation',
}

export const VSCODE_OPENAI_SETUP_QP = {
  PROVIDER_VSCODE_LABEL: '$(pulse)  vscode-openai',
  PROVIDER_VSCODE_DESC: '(Sponsored) Use vscode-openai service',

  PROVIDER_OPENAI_LABEL: '$(vscode-openai)  openai.com',
  PROVIDER_OPENAI_DESC:
    '(BYOK) Use your own OpenAI subscription (api.openai.com)',

  PROVIDER_AZURE_LABEL: '$(azure)  openai.azure.com',
  PROVIDER_AZURE_DESC:
    '(BYOK) Use your own Azure OpenAI instance (instance.openai.azure.com)',

  PROVIDER_CREDAL_LABEL: '$(comment)  credal.ai',
  PROVIDER_CREDAL_DESC: '(BYOK) Use your own Credal instance (credal.ai)',

  PROVIDER_CUSTOM_LABEL: '$(server-environment)  custom',
  PROVIDER_CUSTOM_DESC:
    '(BYOI) Use your own instance LLM or SLM (openai-api support required)',

  MODEL_CHANGE_LABEL: '$(extensions)  change models',
  MODEL_CHANGE_DESC: 'change chat and embedding model',

  CONFIGURATION_RESET_LABEL: '$(workspace-untrusted)  reset...',
  CONFIGURATION_RESET_DESC: 'reset vscode-openai configuration',
}

export const VSCODE_OPENAI_PERSONA_QUICK_PICK = {
  CONFIGURATION_PROMPTS: '$(tools) Customize Prompts...',
}
