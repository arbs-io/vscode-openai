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
import { LocalStorageService } from '../vscode-utils'
import { getNonce } from '../vscode-utils/webviewServices/getNonce'
import { getUri } from '../vscode-utils/webviewServices/getUri'

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
   * Sets up an event listener to listen for messages passed from the webview context and
   * executes code based on the message that is recieved.
   *
   * @param webview A reference to the extension webview
   * @param context A reference to the extension context
   *
   * Event Model:
   *    | source  	| target  	 | command						   | model  	        |
   *    |-----------|------------|-----------------------|------------------|
   *    | extension	| webview    | loadConversations     | IPersonaOpenAI[] |
   *
   */
  private _sendWebviewLoadConversations() {
    const keys = LocalStorageService.instance.keys()
    const conversations: IConversation[] = []

    keys.forEach((key) => {
      console.log(key)
      if (key.startsWith('conversation-')) {
        const conversation =
          LocalStorageService.instance.getValue<IConversation>(key)
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
    // webview.onDidReceiveMessage((message) => {
    //   switch (message.command) {
    //     case 'newConversation':
    //       //need to validate the persona uuid
    //       console.log('personaWebviewProvider::newConversation')
    //       // eslint-disable-next-line no-case-declarations
    //       const personaOpenAI: IPersonaOpenAI = JSON.parse(message.text)
    //       this._createNewConversation(personaOpenAI, extensionUri)
    //       return
    //     default:
    //       window.showErrorMessage(message.command)
    //       return
    //   }
    // }, null)
  }
}
