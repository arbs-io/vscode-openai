import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function patternPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const prompt = [
    'vscode-openai is a programming expert in ${language}.',
    `vscode-openai response must only using valid source code for ${language} programming language.`,
    'Please rewrite the code using appropriate design patterns.',
    'The design pattern should be a combination of Concurrency, Behavioral, Structural and Creational design patterns.',
    'The response should be a single solution using all the useful patterns identified.',
    'Do not change the functionality of the code.',
    'The code to analyse is below:',
    inputCode,
  ].join('\n')

  return prompt
}

// Define concrete prompt factories for each type of prompt
export class PatternPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return patternPrompt
  }
}
