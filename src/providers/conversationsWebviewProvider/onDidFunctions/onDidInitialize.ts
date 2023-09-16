import { WebviewView } from 'vscode'
import { ConversationStorageService } from '@app/services'

export const onDidInitialize = (_webView: WebviewView): void => {
  ConversationStorageService.instance.refresh()
}
