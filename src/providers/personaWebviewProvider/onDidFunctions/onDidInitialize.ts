import { WebviewView } from 'vscode'
import { getSystemPersonas } from '@app/models'

export const onDidInitialize = (webView: WebviewView): void => {
  webView?.webview.postMessage({
    command: 'onWillPersonasLoad',
    text: JSON.stringify(getSystemPersonas()),
  })
}
