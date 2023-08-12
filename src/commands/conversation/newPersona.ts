import { ExtensionContext } from 'vscode'
import { Command } from '../commandManager'
import { quickPickCreateConversation } from '@app/utilities/quickPicks'

export default class NewConversationPersonaCommand implements Command {
  public readonly id = 'vscode-openai.conversation.new.persona'
  public constructor(private _context: ExtensionContext) {}

  public async execute() {
    quickPickCreateConversation(this._context)
  }
}
