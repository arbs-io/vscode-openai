import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'

export default class CodePatternsCommand implements Command {
  public readonly id = '_vscode-openai.editor.code.patterns'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.patterns')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'Developer/Programmer'
    )
    compareResultsToClipboard(persona, prompt)
  }
}
