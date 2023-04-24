import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function explainPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Add header comments to the following code to explain the purpose, input parameters, and output of each function:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Use the following rules. The response must use the ${language} programming language. The response should only contain source code and comments in ${language}. Do not use markdown or fenced code block in your response.`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

export class ExplainPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return explainPrompt
  }
}
