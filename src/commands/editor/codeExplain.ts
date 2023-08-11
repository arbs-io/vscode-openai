import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'

export default class CodeExplainCommand implements Command {
  public readonly id = 'vscode-openai.editor.code.explain'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.explain')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'Developer/Programmer'
    )
    compareResultsToClipboard(persona, prompt)
  }
}
