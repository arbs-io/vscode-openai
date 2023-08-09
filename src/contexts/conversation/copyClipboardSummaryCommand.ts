import { Command } from '../commandManager'
import { showMessageWithTimeout } from '@app/utilities/vscode'

export class CopyClipboardSummaryCommand implements Command {
  public readonly id = 'vscode-openai.conversation.clipboard-summary'

  public constructor() {}

  public execute(args: { data: string }) {
    showMessageWithTimeout(args.data, 5000)
  }
}
