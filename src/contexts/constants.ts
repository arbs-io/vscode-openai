// This file contains constants used throughout the vscode-openai extension.

// VSCODE_OPENAI_REGISTER: Contains the command ID for registering the OpenAI service.
// Input: None
// Output: A string representing the command ID for registering the OpenAI service.
export const VSCODE_OPENAI_REGISTER = {
  SERVICE_COMMAND_ID: 'vscode-openai.register.openaiService',
}

// VSCODE_OPENAI_SCM: Contains the command ID for commenting on a change in source control management.
// Input: None
// Output: A string representing the command ID for commenting on a change in source control management.
export const VSCODE_OPENAI_SCM = {
  COMMENT_COMMAND_ID: 'vscode-openai.scm.comment',
}

// VSCODE_OPENAI_PROMPT: Contains various command IDs for prompting OpenAI to complete tasks.
// Input: None
// Output: An object containing strings representing various command IDs for prompting OpenAI to complete tasks.
export const VSCODE_OPENAI_PROMPT = {
  PROMPT_COMMENTS_COMMAND_ID: 'vscode-openai.completion.comment',
  PROMPT_EXPLAIN_COMMAND_ID: 'vscode-openai.completion.explain',
  PROMPT_BOUNTY_COMMAND_ID: 'vscode-openai.completion.bounty',
  PROMPT_OPTIMIZE_COMMAND_ID: 'vscode-openai.completion.optimize',
  PROMPT_PATTERNS_COMMAND_ID: 'vscode-openai.completion.patterns',
}

// VSCODE_OPENAI_SIDEBAR: Contains various command IDs for opening webviews in the sidebar of VS Code.
// Input: None
// Output: An object containing strings representing various command IDs for opening webviews in the sidebar of VS Code.
export const VSCODE_OPENAI_SIDEBAR = {
  PERSONA_COMMAND_ID: 'vscode-openai.sidebar.personaWebview',
  CONVERSATIONS_COMMAND_ID: 'vscode-openai.sidebar.conversationsWebview',
}
