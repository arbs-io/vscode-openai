import * as crypto from 'crypto'
import {
  Webview,
  window,
  Uri,
  ColorThemeKind,
  WebviewView,
  WebviewViewProvider,
  TextDocument,
} from 'vscode'
import { LocalStorageService } from '../vscode-utils'
import { getNonce } from '../vscode-utils/webviewServices/getNonce'
import { getUri } from '../vscode-utils/webviewServices/getUri'
import { ChatThreadPanel } from './ChatThreadPanel'

export class PersonaProvider implements WebviewViewProvider {
  _view?: WebviewView
  _doc?: TextDocument

  constructor(private readonly _extensionUri: Uri) {}

  public resolveWebviewView(webviewView: WebviewView) {
    this._view = webviewView

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    }

    webviewView.webview.html = this._getHtmlForWebview(
      webviewView.webview,
      this._extensionUri
    )

    this._setWebviewMessageListener(webviewView.webview, this._extensionUri)
  }

  public revive(panel: WebviewView) {
    this._view = panel
  }

  private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
    const scriptUri = getUri(webview, extensionUri, [
      'out',
      'webview-ui',
      'persona',
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
   *    | source  	| target  	 | command						   | model  	      |
   *    |-----------|------------|-----------------------|----------------|
   *    | webview		| extension  | newChatThread				 | TableRowId     |
   *
   */
  private _setWebviewMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'newChatThread':
          this._createNewChat(message.text)
          ChatThreadPanel.render(extensionUri)
          return
        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }

  private _createNewChat(persona: string) {
    const uuid4 = crypto.randomUUID()
    window.showInformationMessage(`${persona} - ${uuid4}`)
    // LocalStorageService.instance.setValue("ChatThreads", value)
  }
}
