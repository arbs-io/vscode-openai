import { Command } from '../commandManager'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'

export default class CodeCommentCommand implements Command {
  public readonly id = '_vscode-openai.editor.code.comment'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.comment')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === VSCODE_OPENAI_QP_PERSONA.DEVELOPER
    )
    compareResultsToClipboard(persona, prompt)
  }
}
