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
import { IConversation } from '@app/types'
import { getNonce, getUri } from '@app/apis/vscode'
import { ConversationStorageService } from '@app/services'
import {
  onDidInitialize,
  onDidOpenConversationWebview,
  onDidOpenConversationJson,
  onDidOpenConversationMarkdown,
  onDidConversationDelete,
} from './onDidFunctions'

export class ConversationsWebviewProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {
    window.onDidChangeActiveColorTheme((_theme: ColorTheme) => {
      this._refreshWebview()
    })

    ConversationStorageService.onDidChangeConversationStorage((_e) => {
      if (this._view?.visible) {
        // onDidInitialize(this._view)
        const conversations = ConversationStorageService.instance.getAll()
        this._view?.webview.postMessage({
          command: 'onWillConversationsLoad',
          text: JSON.stringify(conversations),
        })
      }
    }, null)
  }

  public resolveWebviewView(
    webviewView: WebviewView,
    _context: WebviewViewResolveContext,
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
            <title>ConversationsWebview</title>
          </head>
          <body style="margin:0;padding:0">
            <div id="root" theme='${panelTheme}' data-vscode-context='{"webviewSection": "main", "preventDefaultContextMenuItems": true}' />
            <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          </body>
        </html>
      `
  }

  /**
   *
   * Event Model:
   *    | source		| target		| command															| model						|
   *    |-----------|-----------|-------------------------------------|-----------------|
   *    | webview		| extension	| onDidInitialize											|									|
   *    | extension	| webview		| onWillConversationsLoad							| IConversation[]	|
   *    | webview		| extension	| onDidOpenConversationWebview				| IConversation		|
   *    | webview		| extension	| onDidOpenConversationJson						| IConversation		|
   *    | webview		| extension	| onDidOpenConversationMarkdown				| IConversation		|
   *    | webview		| extension	| onDidConversationDelete							| IConversation		|
   *
   */

  private _onDidMessageListener(webview: Webview, _extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'onDidInitialize': {
          if (this._view) onDidInitialize(this._view)
          return
        }

        case 'onDidOpenConversationWebview': {
          const conversation: IConversation = JSON.parse(message.text)
          onDidOpenConversationWebview(conversation)
          return
        }

        case 'onDidOpenConversationJson': {
          const conversation: IConversation = JSON.parse(message.text)
          onDidOpenConversationJson(conversation)
          return
        }

        case 'onDidOpenConversationMarkdown': {
          const conversation: IConversation = JSON.parse(message.text)
          onDidOpenConversationMarkdown(conversation)
          return
        }

        case 'onDidConversationDelete': {
          const conversation: IConversation = JSON.parse(message.text)
          onDidConversationDelete(conversation)
          return
        }

        default: {
          window.showErrorMessage(message.command)
          return
        }
      }
    }, null)
  }
}
