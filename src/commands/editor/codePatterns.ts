import { Command } from '@app/commands'
import { getSystemPersonas } from '@app/models'
import {
  compareResultsToClipboard,
  getEditorPrompt,
} from '@app/utilities/editor'
import { VSCODE_OPENAI_QP_PERSONA } from '@app/constants'

export default class CodePatternsCommand implements Command {
  public readonly id = '_vscode-openai.editor.code.pattern'

  public async execute() {
    const prompt = await getEditorPrompt('editor.code.pattern')
    const persona = getSystemPersonas().find(
      (a) => a.roleName === VSCODE_OPENAI_QP_PERSONA.DEVELOPER
    )
    compareResultsToClipboard(persona, prompt)
  }
}
