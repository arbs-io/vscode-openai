import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function optimizePrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const prompt = [
    'vscode-openai is a programming expert in ${language}.',
    `vscode-openai response must only using valid source code for ${language} programming language.`,
    'Please optimize the source code by reducing the number of operations performed during execution.',
    'Do not change the functionality of the code.',
    'The code to analyse is below:',
    inputCode,
  ].join('\n')

  return prompt
}

// Define concrete prompt factories for each type of prompt
export class OptimizePromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return optimizePrompt
  }
}
