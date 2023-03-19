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
  ColorTheme,
} from 'vscode'
import { IConversation } from '../interfaces'
import { getNonce, getUri } from '../vscodeUtilities'
import { ConversationService } from '../contexts'

export class ConversationsWebviewProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {
    window.onDidChangeActiveColorTheme((theme: ColorTheme) => {
      this._refreshWebview()
    })

    ConversationService.onDidChange((e) => {
      if (this._view?.visible) {
        this._sendWebviewLoadData()
      }
    }, null)
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    context: WebviewViewResolveContext,
    _token: CancellationToken
  ) {
    this._view = webviewView
    this._view.onDidChangeVisibility((e) => {
      if (this._view?.visible) {
        this._sendWebviewLoadData()
      }
    }, null)

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri],
    }

    this._refreshWebview()
  }

  private _refreshWebview() {
    if (!this._view) return
    this._view.webview.html = this._getHtmlForWebview(
      this._view.webview,
      this._extensionUri
    )

    this._setWebviewMessageListener(this._view.webview, this._extensionUri)
    this._sendWebviewLoadData()
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
   *    | source		| target		| command												| model						|
   *    |-----------|-----------|-------------------------------|-----------------|
   *    | extension	| webview		| rqstViewLoadConversations			| IConversation[]	|
   *    | webview		| extension	| rcvdViewDeleteConversation		| IConversation		|
   *
   *
   */
  private _sendWebviewLoadData() {
    const conversations = ConversationService.instance.getAll()
    this._view?.webview.postMessage({
      command: 'rqstViewLoadConversations',
      text: JSON.stringify(conversations),
    })
  }

  private _setWebviewMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'openConversation':
          // eslint-disable-next-line no-case-declarations
          const openConversation: IConversation = JSON.parse(message.text)
          ConversationService.instance.show(openConversation.conversationId)
          return

        case 'rcvdViewDeleteConversation':
          // eslint-disable-next-line no-case-declarations
          const deleteConversation: IConversation = JSON.parse(message.text)
          ConversationService.instance.delete(deleteConversation.conversationId)
          return

        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }
}
