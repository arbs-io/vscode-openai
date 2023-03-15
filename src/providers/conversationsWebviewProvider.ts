import {
  Webview,
  window,
  Uri,
  ColorThemeKind,
  WebviewView,
  WebviewViewProvider,
  TextDocument,
  WebviewViewResolveContext,
  CancellationToken,
} from 'vscode'
import { IConversation } from '../interfaces/IConversation'
import { GlobalStorageService } from '../vscodeUtilities'
import { getNonce } from '../vscodeUtilities/webviewServices/getNonce'
import { getUri } from '../vscodeUtilities/webviewServices/getUri'
import { ChatMessageViewerPanel } from '../panels/messageWebviewPanel'

export class ConversationsProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      this._extensionUri
    )

    this._setWebviewMessageListener(webviewView.webview, this._extensionUri)
    this._sendWebviewLoadConversations()

    this._view.onDidChangeVisibility((e) => {
      if (this._view?.visible) {
        this._sendWebviewLoadConversations()
      }
    }, null)
  }

  private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
    const scriptUri = getUri(webview, extensionUri, [
      'out',
      'webview-ui',
      'conversationsWebview',
      'index.js',
    ])

    const panelTheme = {
      [ColorThemeKind.Light]: 'light',
      [ColorThemeKind.Dark]: 'dark',
      [ColorThemeKind.HighContrast]: 'dark',
      [ColorThemeKind.HighContrastLight]: 'light',
    }[window.activeColorTheme.kind]

    const nonce = getNonce()

    return /*html*/ `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src * 'self' data: https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';">
            <title>Claimset</title>
          </head>
          <body style="margin:0;padding:0">
            <div id="root" theme='${panelTheme}' />
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `
  }

  /**
   *
   * Event Model:
   *    | source  	| target  	 | command						   | model  	        |
   *    |-----------|------------|-----------------------|------------------|
   *    | extension	| webview    | loadConversations     | IConversation[]  |
   *    | webview   | extension  | deleteConversation    | IConversation    |
   *
   *
   */
  private _sendWebviewLoadConversations() {
    const keys = GlobalStorageService.instance.keys()
    const conversations: IConversation[] = []

    keys.forEach((key) => {
      console.log(key)
      if (key.startsWith('conversation-')) {
        const conversation =
          GlobalStorageService.instance.getValue<IConversation>(key)
        if (conversation !== undefined) {
          conversations.push(conversation)
        }
      }
    })

    console.log(
      `conversationsWebviewProvider::_sendWebviewLoadConversations ${conversations.length}`
    )

    this._view?.webview.postMessage({
      command: 'loadConversations',
      text: JSON.stringify(conversations),
    })
  }

  private _setWebviewMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'openConversation':
          // eslint-disable-next-line no-case-declarations
          const openConversation: IConversation = JSON.parse(message.text)
          ChatMessageViewerPanel.render(extensionUri, openConversation)
          return

        case 'deleteConversation':
          // eslint-disable-next-line no-case-declarations
          const deleteConversation: IConversation = JSON.parse(message.text)
          GlobalStorageService.instance.deleteKey(
            `conversation-${deleteConversation.conversationId}`
          )
          this._sendWebviewLoadConversations()
          return

        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }
}
