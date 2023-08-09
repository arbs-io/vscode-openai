import { ExtensionContext } from 'vscode'
import { Command } from '../commandManager'
import { quickPickCreateConversation } from '@app/quickPicks'

export default class NewConversationPersonaCommand implements Command {
  public readonly id = 'vscode-openai.conversations.new.conversation.persona'
  public constructor(private _context: ExtensionContext) {}

  public async execute() {
    quickPickCreateConversation(this._context)
  }
}
