import { workspace } from 'vscode';
import { PromptFactory } from './promptFactory';
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/apis/vscode';

async function commentPrompt(): Promise<string> {
  const language = getActiveTextLanguageId();
  const inputCode = getActiveTextEditorValue();

  let prompt = workspace
    .getConfiguration('vscode-openai')
    .get('prompt-editor.comment') as string;

  prompt = prompt.split('#{language}').join(language);
  prompt = prompt.split('#{source_code}').join(inputCode);
  return prompt;
}

// Define concrete prompt factories for each type of prompt
export class CommentPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return commentPrompt;
  }
}
