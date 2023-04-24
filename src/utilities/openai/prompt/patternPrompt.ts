import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function patternPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Please analyze the following source code and rewrite it using appropriate design patterns. The design pattern include but are not limited to Singleton, Factory, Builder, ... Return the updated code with comments next to each line of code explaining the design patterns used. Only include comments if the code is complex enough to require an explanation:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Use the following rules. The response must use the ${language} programming language. The response should only contain source code and comments in ${language}. Do not use markdown or fenced code block in your response.`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class PatternPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return patternPrompt
  }
}
