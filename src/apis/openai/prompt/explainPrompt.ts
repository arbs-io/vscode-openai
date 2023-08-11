import { workspace } from 'vscode'
import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/apis/vscode'

async function explainPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  let prompt = workspace
    .getConfiguration('vscode-openai')
    .get('prompt-editor.explain') as string

  prompt = prompt.split('#{language}').join(language)
  prompt = prompt.split('#{source_code}').join(inputCode)
  return prompt
}

export class ExplainPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return explainPrompt
  }
}
