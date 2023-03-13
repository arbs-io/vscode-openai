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
import { ChatMessageViewerPanel } from './chatMessageViewerPanel'
import { IConversation } from '../interfaces/IConversation'
import { SystemPersonas } from './data/SystemPersonas'
import { IPersonaOpenAI } from '../interfaces/IPersonaOpenAI'

export class ChatPersonaProvider implements WebviewViewProvider {
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

    console.log(`ChatPersonaProvider::SystemPersonas ${SystemPersonas.length}`)
    this._view.webview.postMessage({
      command: 'loadPersonas',
      text: JSON.stringify(SystemPersonas),
    })
  }

  public revive(panel: WebviewView) {
    this._view = panel
  }

  private _getHtmlForWebview(webview: Webview, extensionUri: Uri) {
    const scriptUri = getUri(webview, extensionUri, [
      'out',
      'webview-ui',
      'chatPersona',
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
   *    | webview		| extension  | newConversation				 | TableRowId     |
   *
   */
  private _setWebviewMessageListener(webview: Webview, extensionUri: Uri) {
    webview.onDidReceiveMessage((message) => {
      switch (message.command) {
        case 'newConversation':
          //need to validate the persona uuid
          // eslint-disable-next-line no-case-declarations
          const personaOpenAI: IPersonaOpenAI = JSON.parse(message.text)
          this._createNewConversation(personaOpenAI, extensionUri)
          return
        default:
          window.showErrorMessage(message.command)
          return
      }
    }, null)
  }

  private _createNewConversation(persona: IPersonaOpenAI, extensionUri: Uri) {
    const uuid4 = crypto.randomUUID()
    const conversation: IConversation = {
      conversationId: uuid4,
      persona: persona,
      summary: '<New Conversation>',
      chatMessages: [],
    }

    LocalStorageService.instance.setValue<IConversation>(
      `conversation-${conversation.conversationId}`,
      conversation
    )

    ChatMessageViewerPanel.render(extensionUri, conversation)
    return

    const keys = LocalStorageService.instance.keys()
    keys.forEach((key) => {
      console.log(key)
      LocalStorageService.instance.deleteKey(key)
      // if (key.startsWith('convo-')) {
      //   console.log(key)
      //   LocalStorageService.instance.deleteKey(key)
      // }
    })

    let conversations =
      LocalStorageService.instance.getValue<Array<IConversation>>(
        'conversations-v0'
      )
    if (conversations === undefined) conversations = []

    conversations.push(conversation)
    LocalStorageService.instance.setValue<IConversation[]>(
      'conversations-v0',
      conversations
    )
  }
}
