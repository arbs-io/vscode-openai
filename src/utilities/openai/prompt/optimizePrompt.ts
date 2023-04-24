import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function optimizePrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Please optimize the following code by reducing the number of operations performed during execution, without changing the functionality of the code. Please provide comments for any lines that require explanation:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Use the following rules. The response must use the ${language} programming language. The response should only contain source code and comments in ${language}. Do not use markdown or fenced code block in your response.`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class OptimizePromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return optimizePrompt
  }
}
