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
import { IConversation } from '@app/interfaces'
import { getNonce, getUri } from '@app/utilities/vscode'
import { ConversationService } from '@app/services'

export class ConversationsWebviewProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {
    window.onDidChangeActiveColorTheme((theme: ColorTheme) => {
      this._refreshWebview()
    })

    ConversationService.onDidChange((e) => {
      if (this._view?.visible) {
        this._onWillConversationsLoad()
      }
    }, null)
  }

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

    this._refreshWebview()
  }

  private _refreshWebview() {
    if (!this._view) return
    this._view.webview.html = this._getHtmlForWebview(
      this._view.webview,
      this._extensionUri
    )

    this._onDidMessageListener(this._view.webview, this._extensionUri)
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
   *    | webview		| extension	| onDidInitialize								|									|
   *    | extension	| webview		| onWillConversationsLoad				| IConversation[]	|
   *    | webview		| extension	| onDidConversationDelete				| IConversation		|
   *    | webview		| extension	| onDidConversationOpen					| IConversation		|
   *
   *
   */
  private _onWillConversationsLoad() {
    const conversations = ConversationService.instance.getAll()
    this._view?.webview.postMessage({
      command: 'onWillConversationsLoad',
      text: JSON.stringify(conversations),
    })
  }

  private _onDidMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'onDidInitialize': {
          this._onWillConversationsLoad()
          return
        }
        case 'onDidConversationOpen': {
          const onDidConversationOpen: IConversation = JSON.parse(message.text)
          ConversationService.instance.show(
            onDidConversationOpen.conversationId
          )
          return
        }

        case 'onDidConversationDelete': {
          const deleteConversation: IConversation = JSON.parse(message.text)
          ConversationService.instance.delete(deleteConversation.conversationId)
          return
        }

        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }
}
