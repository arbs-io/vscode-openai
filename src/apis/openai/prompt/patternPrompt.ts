import { workspace } from 'vscode';
import { PromptFactory } from './promptFactory';
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/apis/vscode';

export async function patternPrompt(): Promise<string> {
  const language = getActiveTextLanguageId();
  const inputCode = getActiveTextEditorValue();

  let prompt = workspace
    .getConfiguration('vscode-openai')
    .get('prompt-editor.patterns') as string;

  prompt = prompt.split('#{language}').join(language);
  prompt = prompt.split('#{source_code}').join(inputCode);
  return prompt;
}

// Define concrete prompt factories for each type of prompt
export class PatternPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return patternPrompt;
  }
}
