import { commands } from 'vscode';
import { IConversation } from '@app/interfaces';

export const onDidOpenConversationWebview = (
  conversation: IConversation
): void => {
  commands.executeCommand('_vscode-openai.conversation.open.webview', {
    data: conversation,
  });
};
