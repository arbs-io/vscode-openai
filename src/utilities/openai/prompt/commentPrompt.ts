import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function commentPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const prompt = [
    `vscode-openai is a programming expert in ${language}.`,
    `vscode-openai response must only using valid source code for ${language} programming language.`,
    'Please add comments to the source code explaining what the code is doing.',
    'The code to analyse is below:',
    inputCode,
  ].join('\n')

  return prompt
}

// Define concrete prompt factories for each type of prompt
export class CommentPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return commentPrompt
  }
}
