import { Command } from '../commandManager'
import { IConversation } from '@app/types'
import { openConversationMarkdown } from '@app/utilities/conversation'

export default class OpenConversationMarkdownCommand implements Command {
  public readonly id = 'vscode-openai.conversation.open.markdown'

  public execute(args: { data: IConversation }) {
    openConversationMarkdown(args.data)
  }
}
