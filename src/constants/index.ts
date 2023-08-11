// This file contains constants used throughout the vscode-openai extension.

// VSCODE_OPENAI_EXTENSION: Contains the command ID for extension activation.
// Input: None
// Output: A string representing the command ID for registering the OpenAI service.
export const VSCODE_OPENAI_EXTENSION = {
  INSTRUMENTATION_KEY: 'e01c0a97-9930-4885-b2e8-772176ced488',
  ENABLED_COMMAND_ID: 'vscode-openai.extension.enabled',
}

// VSCODE_OPENAI_EMBEDDING: Contains the command ID for deleting embedding results.
// Input: None
// Output: A string representing the command ID for commenting on a change in source control management.
export const VSCODE_OPENAI_EMBEDDING = {
  ENABLED_COMMAND_ID: 'vscode-openai.embedding.enabled',
  SETUP_REQUIRED_COMMAND_ID: 'vscode-openai.embedding.setup-required',
  RESOURCE_QUERY_ALL: '057c0000-0000-0000-0000-000000000000',
  STORAGE_V1_ID: 'embedding.v1',
  STORAGE_V2_ID: 'embedding.v2',
}

// VSCODE_OPENAI_EMBEDDING: Contains the command ID for deleting embedding results.
// Input: None
// Output: A string representing the command ID for commenting on a change in source control management.
export const VSCODE_OPENAI_CONVERSATION = {
  STORAGE_V1_ID: 'conversation',
}

// VSCODE_OPENAI_PROMPT: Contains various command IDs for prompting OpenAI to complete tasks.
// Input: None
// Output: An object containing strings representing various command IDs for prompting OpenAI to complete tasks.
export const VSCODE_OPENAI_PROMPT = {
  // PROMPT_COMMENTS_COMMAND_ID: 'vscode-openai.editor.code.comments',
  PROMPT_EXPLAIN_COMMAND_ID: 'vscode-openai.prompt-editor.explain',
  PROMPT_BOUNTY_COMMAND_ID: 'vscode-openai.prompt-editor.bounty',
  PROMPT_OPTIMIZE_COMMAND_ID: 'vscode-openai.prompt-editor.optimize',
  PROMPT_PATTERNS_COMMAND_ID: 'vscode-openai.prompt-editor.patterns',
}

// VSCODE_OPENAI_SIDEBAR: Contains various command IDs for opening webviews in the sidebar of VS Code.
// Input: None
// Output: An object containing strings representing various command IDs for opening webviews in the sidebar of VS Code.
export const VSCODE_OPENAI_SERVICE_PROVIDER = {
  VSCODE_OPENAI: '$(pulse)  vscode-openai',
  OPENAI: '$(vscode-openai)  openai.com',
  AZURE_OPENAI: '$(azure)  openai.azure.com',
  CREDAL: '$(comment)  credal.ai',
  CHANGE_MODEL: '$(extensions)  change models',
}
