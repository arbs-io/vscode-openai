import { env } from 'vscode'
import { ICommand } from '@app/commands'
import { showMessageWithTimeout } from '@app/apis/vscode'
import { IChatCompletion } from '@app/interfaces'

export default class ClipboardCopyMessagesMessageCommand implements ICommand {
  public readonly id = '_vscode-openai.messages.clipboard-copy.message'

  public execute(args: { data: IChatCompletion }) {
    const content = args.data.content
    env.clipboard.writeText(content)
    showMessageWithTimeout(`Clipboard-Copy: ${content}`, 5000)
  }
}
