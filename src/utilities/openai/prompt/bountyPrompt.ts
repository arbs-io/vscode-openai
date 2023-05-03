import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const prompt = [
    'vscode-openai is a programming expert in ${language}.',
    `vscode-openai response must only using valid source code for ${language} programming language.`,
    'Please fix any bugs and include comments for changed code explaining what was wrong with the original code.',
    'The code to analyse is below',
    inputCode,
  ].join('\n')

  return prompt
}

// Define concrete prompt factories for each type of prompt
export class BountyPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return bountyPrompt
  }
}
