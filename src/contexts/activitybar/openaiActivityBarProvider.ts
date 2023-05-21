import { ExtensionContext, commands, window } from 'vscode'
import {
  ConversationsWebviewProvider,
  FileEmbeddingTreeDataProvider,
  PersonaWebviewProvider,
} from '@app/providers'
import { VSCODE_OPENAI_SIDEBAR } from '@app/contexts'
import { VscodeOpenaiTreeItem } from '@app/providers/fileEmbeddingTreeDataProvider/fileEmbeddingTreeDataProvider'

export class OpenaiActivityBarProvider {
  private static instance: OpenaiActivityBarProvider

  public static getInstance(): OpenaiActivityBarProvider {
    if (!OpenaiActivityBarProvider.instance) {
      OpenaiActivityBarProvider.instance = new OpenaiActivityBarProvider()
    }
    return OpenaiActivityBarProvider.instance
  }

  public registerPersonaWebviewView(context: ExtensionContext) {
    const sidebarProvider = new PersonaWebviewProvider(context.extensionUri)
    const view = window.registerWebviewViewProvider(
      VSCODE_OPENAI_SIDEBAR.PERSONA_COMMAND_ID,
      sidebarProvider
    )
    context.subscriptions.push(view)
  }

  public registerConversationsWebviewView(context: ExtensionContext) {
    const sidebarProvider = new ConversationsWebviewProvider(
      context.extensionUri
    )
    const view = window.registerWebviewViewProvider(
      VSCODE_OPENAI_SIDEBAR.CONVERSATIONS_COMMAND_ID,
      sidebarProvider
    )
    context.subscriptions.push(view)
  }

  public registerFileEmbeddingTreeDataProvider(context: ExtensionContext) {
    new FileEmbeddingTreeDataProvider(context)
    commands.registerCommand(
      'vscode-openai.fileEmbeddingTreeItem.delete',
      (node: VscodeOpenaiTreeItem) =>
        window.showInformationMessage(
          `Successfully called edit entry on ${node.label}.`
        )
    )
  }
}
