import { window } from 'vscode'
import { IConversation } from '@app/interfaces'
import { ConversationStorageService } from '@app/services'

export const onDidConversationDelete = (conversation: IConversation): void => {
  window
    .showInformationMessage(
      'Are you sure you want to delete this conversation?',
      'Yes',
      'No'
    )
    .then((answer) => {
      if (answer === 'Yes') {
        ConversationStorageService.instance.delete(conversation.conversationId)
      }
    })
}
