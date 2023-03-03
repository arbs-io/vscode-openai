import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '../../vscode-utils'

async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `Act like a programming expert in ${language}.\n`
  const request = `Fix the bugs in the following source code and include comments next to the fixed code to explain any changes made. Use the prefix "Bugfix: " for each comment where necessary:\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = ``
  const prompt = persona.concat(request, sourceCode, rules)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class BountyPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return bountyPrompt
  }
}
