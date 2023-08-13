import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'

export default class CodeCommentCommand implements Command {
  public readonly id = '_vscode-openai.editor.code.comments'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.comments')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === 'Developer/Programmer'
    )
    compareResultsToClipboard(persona, prompt)
  }
}
