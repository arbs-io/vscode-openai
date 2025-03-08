import { window } from 'vscode';
import { ICommand } from '@app/commands';
import { IConversation } from '@app/interfaces';
import { ConversationStorageService } from '@app/services';

export default class DeleteConversationCommand implements ICommand {
  public readonly id = '_vscode-openai.conversation.delete';

  public execute(args: { data: IConversation }) {
    window
      .showInformationMessage(
        'Are you sure you want to delete this conversation?',
        'Yes',
        'No'
      )
      .then((answer) => {
        if (answer === 'Yes') {
          ConversationStorageService.instance.delete(args.data.conversationId);
        }
      });
  }
}
