import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'

export default class CodeOptimizeCommand implements Command {
  public readonly id = 'vscode-openai.editor.code.optimize'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.optimize')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'Developer/Programmer'
    )
    compareResultsToClipboard(persona, prompt)
  }
}
