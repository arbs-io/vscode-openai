import { Command } from '../commandManager'
import { IConversation } from '@app/types'
import { openConversationJson } from '@app/utilities/conversation'

export default class OpenConversationJsonCommand implements Command {
  public readonly id = 'vscode-openai.conversation.open.json'

  public execute(args: { data: IConversation }) {
    openConversationJson(args.data)
  }
}
