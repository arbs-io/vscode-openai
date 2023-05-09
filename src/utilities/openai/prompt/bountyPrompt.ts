import { workspace } from 'vscode'
import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  let prompt = workspace
    .getConfiguration('vscode-openai')
    .get('prompt-editor.bounty') as string

  prompt = prompt.split('#{language}').join(language)
  prompt = prompt.split('#{source_code}').join(inputCode)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class BountyPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return bountyPrompt
  }
}
