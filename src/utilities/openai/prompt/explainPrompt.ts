import { PromptFactory } from './promptFactory'
import {
  getActiveTextEditorValue,
  getActiveTextLanguageId,
} from '@app/utilities/vscode'

async function explainPrompt(): Promise<string> {
  const language = getActiveTextLanguageId()
  const inputCode = getActiveTextEditorValue()

  const prompt = [
    `vscode-openai is a programming expert in ${language}.`,
    `vscode-openai response must only using valid source code for ${language} programming language.`,
    'Please provide headers comments for each function in the source code for each function providing:',
    '- description, input and output parameters.',
    '- input parameters.',
    '- output parameters.',
    'The code to analyse is below:',
    inputCode,
  ].join('\n')

  return prompt
}

export class ExplainPromptFactory implements PromptFactory {
  createPrompt(): () => Promise<string> {
    return explainPrompt
  }
}
