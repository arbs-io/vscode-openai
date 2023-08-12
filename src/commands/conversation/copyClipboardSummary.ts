import { env } from 'vscode'
import { Command } from '../commandManager'
import { showMessageWithTimeout } from '@app/apis/vscode'
import { IConversation } from '@app/types'

export default class ClipboardCopyConversationSummaryCommand
  implements Command
{
  public readonly id = 'vscode-openai.conversation.clipboard-copy.summary'

  public execute(args: { data: IConversation }) {
    const summary = args.data.summary
    env.clipboard.writeText(summary)
    showMessageWithTimeout(`Clipboard-Copy: ${summary}`, 5000)
  }
}
