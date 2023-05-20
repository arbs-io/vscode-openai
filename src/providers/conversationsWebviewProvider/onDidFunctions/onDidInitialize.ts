import { WebviewView } from 'vscode'
import { ConversationService } from '@app/services'

export const onDidInitialize = (webView: WebviewView): void => {
  const conversations = ConversationService.instance.getAll()
  webView?.webview.postMessage({
    command: 'onWillConversationsLoad',
    text: JSON.stringify(conversations),
  })
}
