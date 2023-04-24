import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Fix the bugs in the following source code and include comments next to the fixed code to explain any changes made. Use the prefix "Bugfix: " for each bug using ${language} comment notation for the details. The code to review is below:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `Use the following rules. The response must use the ${language} programming language. The response should only contain source code and comments in ${language}. Do not use markdown or fenced code block in your response.`
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class BountyPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return bountyPrompt
  }
}
