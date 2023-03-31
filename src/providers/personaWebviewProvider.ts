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
import { getNonce, getUri } from '../vscodeUtilities'
import { IConversation, IPersonaOpenAI } from '../interfaces'
import { SystemPersonas } from '../models'
import { ConversationService } from '../contexts'

export class PersonaWebviewProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {
    window.onDidChangeActiveColorTheme((theme: ColorTheme) => {
      this._refreshWebview()
    })
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

    this._setWebviewMessageListener(this._view.webview, this._extensionUri)
    this._sendWebviewLoadData()

    this._view.onDidChangeVisibility((e) => {
      if (this._view?.visible) {
        this._sendWebviewLoadData()
      }
    }, null)
  }

  private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
    const scriptUri = getUri(webview, extensionUri, [
      'out',
      'webview-ui',
      'personaWebview',
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
   *    | source		| target		| command									| model							|
   *    |-----------|-----------|-------------------------|-------------------|
   *    | extension	| webview		| rqstViewLoadPersonas		| IPersonaOpenAI[]	|
   *    | webview		| extension	| rcvdViewNewConversation	| IPersonaOpenAI		|
   *
   */
  private _sendWebviewLoadData() {
    this._view?.webview.postMessage({
      command: 'rqstViewLoadPersonas',
      text: JSON.stringify(SystemPersonas),
    })
  }

  private _setWebviewMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'rcvdViewNewConversation': {
          const persona: IPersonaOpenAI = JSON.parse(message.text)
          const conversation: IConversation =
            ConversationService.instance.create(persona)
          ConversationService.instance.update(conversation)
          ConversationService.instance.show(conversation.conversationId)
          return
        }

        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }
}
