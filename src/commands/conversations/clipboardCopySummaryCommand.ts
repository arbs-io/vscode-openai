import { Command } from '../commandManager'
import { showMessageWithTimeout } from '@app/apis/vscode'

export default class ClipboardCopySummaryCommand implements Command {
  public readonly id = 'vscode-openai.conversations.clipboard-copy.summary'

  public execute(args: { data: string }) {
    showMessageWithTimeout(args.data, 5000)
  }
}
