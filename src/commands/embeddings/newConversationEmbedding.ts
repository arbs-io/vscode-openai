import { ICommand } from '@app/commands';
import { IConversation } from '@app/interfaces';
import { ConversationStorageService } from '@app/services';
import { EmbeddingTreeItem } from '@app/providers';
import { getQueryResourcePersona } from '@app/models';

export default class NewConversationEmbeddingCommand implements ICommand {
  public readonly id = 'vscode-openai.embeddings.new.conversation';

  public async execute(node: EmbeddingTreeItem) {
    const persona = getQueryResourcePersona();
    const conversation: IConversation =
      await ConversationStorageService.instance.create(
        persona,
        node.embeddingId
      );
    ConversationStorageService.instance.update(conversation);
    ConversationStorageService.instance.show(conversation.conversationId);
  }
}
