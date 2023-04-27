import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function explainPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `vscode-openai is a programming expert in ${language}.\n`
  const request = `Given the following code, provide headers comments for each function providing a description, input and output parameters.\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `vscode-openai response must only using valid source code for ${language} programming language.`
  const prompt = persona.concat(rules, request, sourceCode)
  return prompt
}

export class ExplainPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return explainPrompt
  }
}
