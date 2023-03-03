import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '../../vscode-utils'

async function explainPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Add header comments to the following code to explain the purpose, input parameters, and output of each function:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Add a comment above each function definition that includes a description of what the function does, its function parameters, and the function return type. The prompt should only return the original code with the header comments included.\n`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

export class ExplainPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return explainPrompt
  }
}
