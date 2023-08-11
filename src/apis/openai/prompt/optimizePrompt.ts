import { workspace } from 'vscode'
import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/apis/vscode'

export async function optimizePrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  let prompt = workspace
    .getConfiguration('vscode-openai')
    .get('prompt-editor.optimize') as string

  prompt = prompt.split('#{language}').join(language)
  prompt = prompt.split('#{source_code}').join(inputCode)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class OptimizePromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return optimizePrompt
  }
}
