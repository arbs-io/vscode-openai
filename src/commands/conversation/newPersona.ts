import { ExtensionContext } from 'vscode'
import { Command } from '@app/commands'
import { quickPickCreateConversation } from '@app/utilities/quickPicks'

export default class NewConversationPersonaCommand implements Command {
  public readonly id = 'vscode-openai.conversation.new.persona'
  public constructor(private _context: ExtensionContext) {}

  public async execute(): Promise<void> {
    quickPickCreateConversation(this._context)
  }
}
