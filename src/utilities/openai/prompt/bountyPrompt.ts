import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function bountyPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const persona = `vscode-openai is a programming expert in ${language}.\n`
  const request = `Given the following code, fix the bugs and include comments next to explain the problem.\n`
  const sourceCode = `\n${inputCode}\n\n`
  const rules = `vscode-openai response must only using valid source code for ${language} programming language.`
  const prompt = persona.concat(rules, request, sourceCode)
  return prompt
}

// Define concrete prompt factories for each type of prompt
export class BountyPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return bountyPrompt
  }
}
