import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

export async function patternPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `vscode-openai is a programming expert in ${language}.\n`
  const request = `Given the following code, rewrite the code using appropriate design patterns. The design pattern to Concurrency, Behavioral, Structural and Creational patterns. Examples like Factory, Builder, Mediator, ... \n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `vscode-openai response must only using valid source code for ${language} programming language.`
  const prompt = persona.concat(rules, request, sourceCode)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class PatternPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return patternPrompt
  }
}
