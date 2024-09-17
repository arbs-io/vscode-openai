import {
  Disposable,
  Webview,
  WebviewPanel,
  window,
  Uri,
  ViewColumn,
  ColorThemeKind,
  ColorTheme,
  EventEmitter,
  Event,
} from 'vscode'
import { getUri, getNonce } from '@app/apis/vscode'
import { IChatCompletion, ICodeDocument, IConversation } from '@app/interfaces'
import {
  createChatCompletion,
  createChatCompletionStream,
} from '@app/apis/openai'
import {
  onDidCopyClipboardCode,
  onDidCreateDocument,
  onDidSaveMessages,
} from './onDidFunctions'
import {
  ChatCompletionConfigFactory,
  ConversationColorConfig as convColorCfg,
  ConversationConfig as convCfg,
} from '@app/services/configuration'

export class MessageViewerPanel {
  private static _currentPanel: MessageViewerPanel | undefined
  private readonly _panel: WebviewPanel
  private _conversation: IConversation | undefined
  private _disposables: Disposable[] = []
  private readonly _extensionUri: Uri

  private _emitter = new EventEmitter<IConversation>()
  readonly onDidChangeConversation: Event<IConversation> = this._emitter.event

  /**
   * The MessageViewerPanel class private constructor (called only from the render method).
   *
   * @param panel A reference to the webview panel
   * @param extensionUri The URI of the directory containing the extension
   */
  private constructor(panel: WebviewPanel, extensionUri: Uri) {
    this._panel = panel
    this._extensionUri = extensionUri

    this._setPanelIcon()

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables)

    // Set an event listener to listen for messages passed from the webview context
    this._setWebviewMessageListener(this._panel.webview)

    //Check if vscode theme has changed
    window.onDidChangeActiveColorTheme((_theme: ColorTheme) => {
      this._render()
    })
  }

  /**
   * Renders the current webview panel if it exists otherwise a new webview panel
   * will be created and displayed.
   *
   * @param extensionUri The URI of the directory containing the extension.
   */
  public static render(extensionUri: Uri, conversation: IConversation) {
    if (MessageViewerPanel._currentPanel) {
      MessageViewerPanel._currentPanel._panel.dispose()
    }
    // If a webview panel does not already exist create and show a new one
    const panel = window.createWebviewPanel(
      'vscode-openai.webview.messages',
      conversation.persona.roleName,
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        enableFindWidget: true,
        localResourceRoots: [Uri.joinPath(extensionUri, 'out')],
      }
    )

    MessageViewerPanel._currentPanel = new MessageViewerPanel(
      panel,
      extensionUri
    )

    MessageViewerPanel._currentPanel._conversation = conversation
    MessageViewerPanel._currentPanel._render()
  }

  public static postMessage(command: string, value: string) {
    MessageViewerPanel._currentPanel?._panel.webview.postMessage({
      command: command,
      text: value,
    })
  }

  private _render() {
    if (!this._conversation) return

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      this._extensionUri
    )
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    MessageViewerPanel._currentPanel = undefined

    // Dispose of the current webview panel
    this._panel.dispose()

    // Dispose of all disposables (i.e. commands) for the current webview panel
    while (this._disposables.length) {
      const disposable = this._disposables.pop()
      if (disposable) {
        disposable.dispose()
      }
    }
  }

  private _isThemeDark() {
    return {
      [ColorThemeKind.Light]: false,
      [ColorThemeKind.Dark]: true,
      [ColorThemeKind.HighContrast]: true,
      [ColorThemeKind.HighContrastLight]: false,
    }[window.activeColorTheme.kind]
  }

  private _setPanelIcon() {
    const openaiWebviewIcon = this._isThemeDark()
      ? 'openai-webview-dark.png'
      : 'openai-webview-light.png'

    const iconPathOnDisk = Uri.joinPath(
      this._extensionUri,
      'assets',
      openaiWebviewIcon
    )
    this._panel.iconPath = iconPathOnDisk
  }

  /**
   * Defines and returns the HTML that should be rendered within the webview panel.
   *
   * @remarks This is also the place where references to the React webview build files
   * are created and inserted into the webview HTML.
   *
   * @param webview A reference to the extension webview
   * @param extensionUri The URI of the directory containing the extension
   * @returns A template string literal containing the HTML that should be
   * rendered within the webview panel
   */
  private _getWebviewContent(webview: Webview, extensionUri: Uri) {
    const scriptUri = getUri(webview, extensionUri, [
      'out',
      'webview',
      'message',
      'index.js',
    ])

    const panelTheme = this._isThemeDark() ? 'dark' : 'light'

    this._setPanelIcon()
    const nonce = getNonce()

    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta
            http-equiv="Content-Security-Policy"
            content="default-src 'none'; img-src * 'self' data: https:; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}';"
          />
          <title>vscode-openai messages</title>
        </head>
        <body style="margin:0;padding:0">
          <div id="root" theme='${panelTheme}' messageShortcuts='${convCfg.messageShortcuts}' assistantColor='${convColorCfg.assistantColor}' assistantBackground='${convColorCfg.assistantBackground}' userColor='${convColorCfg.userColor}' userBackground='${convColorCfg.userBackground}' data-vscode-context='{"webviewSection": "main", "preventDefaultContextMenuItems": true}' />
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `
  }

  /**
   *
   * Event Model:
   *    | source		| target		| command									| model						  |
   *    |-----------|-----------|-------------------------|-------------------|
   *    | webview		| extension	| onDidInitialize					|									  |
   *    | extension	| webview		| onWillRenderMessages		| IConversation			|
   *    | extension	| webview		| onWillAnswerMessage			| IChatCompletion		|
   *    | webview		| extension	| onDidSaveMessages				| IChatCompletion[]	|
   *    | webview		| extension	| onDidCreateDocument			| ICodeDocument			|
   *    | webview		| extension	| onDidCopyClipboardCode	| ICodeDocument			|
   *
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'onDidInitialize': {
            MessageViewerPanel._currentPanel?._panel.webview.postMessage({
              command: 'onWillRenderMessages',
              text: JSON.stringify(this._conversation!.chatMessages),
            })
            return
          }

          case 'onDidSaveMessages': {
            const chatMessages: IChatCompletion[] = JSON.parse(message.text)

            if (!this._conversation) return
            onDidSaveMessages(this._conversation, chatMessages)
            // If the last item was from user
            if (chatMessages[chatMessages.length - 1].mine === true) {
              this._askQuestion()
            }
            return
          }

          case 'onDidCreateDocument': {
            const codeDocument: ICodeDocument = JSON.parse(message.text)
            onDidCreateDocument(codeDocument)
            return
          }

          case 'onDidCopyClipboardCode': {
            const codeDocument: ICodeDocument = JSON.parse(message.text)
            onDidCopyClipboardCode(codeDocument)
            return
          }

          default: {
            window.showErrorMessage(message.command)
            return
          }
        }
      },
      null,
      this._disposables
    )
  }

  private async _askQuestion(): Promise<void> {
    if (!this._conversation) return

    const cfg = ChatCompletionConfigFactory.createConfig('inference_model')

    function chatCallback(messageType: string, message: string): void {
      MessageViewerPanel.postMessage(messageType, message)
    }

    const isStreamSuccessful = await createChatCompletionStream(
      this._conversation,
      cfg,
      chatCallback
    )

    if (!isStreamSuccessful) {
      await createChatCompletion(this._conversation, cfg, chatCallback)
    }
  }
}
