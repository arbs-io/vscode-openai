import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'

export default class CodeBountyCommand implements Command {
  public readonly id = '_vscode-openai.editor.code.bounty'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.bounty')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'Developer/Programmer'
    )
    compareResultsToClipboard(persona, prompt)
  }
}
