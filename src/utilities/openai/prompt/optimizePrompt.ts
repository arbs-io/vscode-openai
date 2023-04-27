import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function optimizePrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `vscode-openai is a programming expert in ${language}.\n`
  const request = `Given the following code, optimize the code by reducing the number of operations performed during execution, without changing the functionality of the code. Please provide comments for any lines that require explanation:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `vscode-openai response must only using valid source code for ${language} programming language.`
  const prompt = persona.concat(rules, request, sourceCode)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class OptimizePromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return optimizePrompt
  }
}
