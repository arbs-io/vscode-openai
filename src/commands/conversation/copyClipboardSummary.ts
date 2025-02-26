import { env } from 'vscode'
import { ICommand } from '@app/commands'
import { showMessageWithTimeout } from '@app/apis/vscode'
import { IConversation } from '@app/interfaces'

export default class ClipboardCopyConversationSummaryCommand
  implements ICommand
{
  public readonly id = '_vscode-openai.conversation.clipboard-copy.summary'

  // Define the 'execute' method with a single parameter 'args' which is an object containing 'data' of type 'IConversation'.
  public execute(args: { data: IConversation }) {
    // Extract the 'summary' property from the 'data' object passed in 'args'.
    const summary = args.data.summary

    // Use the 'env.clipboard' API to write the 'summary' string to the system clipboard.
    env.clipboard.writeText(summary)

    // Call the 'showMessageWithTimeout' function to display a message with the copied 'summary' and set it to disappear after 5000 milliseconds (5 seconds).
    showMessageWithTimeout(`Clipboard-Copy: ${summary}`, 5000)
  }
}
