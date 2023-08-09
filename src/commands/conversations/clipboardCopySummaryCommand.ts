import { Command } from '../commandManager'
import { showMessageWithTimeout } from '@app/utilities/vscode'

export default class ClipboardCopySummaryCommand implements Command {
  public readonly id = 'vscode-openai.conversations.clipboard-copy.summary'

  public constructor() {}

  public execute(args: { data: string }) {
    showMessageWithTimeout(args.data, 5000)
  }
}
