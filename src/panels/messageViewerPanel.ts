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
import { getUri, getNonce } from '../vscodeUtilities'
import { IChatMessage, IConversation } from '../interfaces'
import { messageCompletion } from '../openaiUtilities'
import { ConversationService } from '../contexts'

export class MessageViewerPanel {
  public static currentPanel: MessageViewerPanel | undefined
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
    window.onDidChangeActiveColorTheme((theme: ColorTheme) => {
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
    if (MessageViewerPanel.currentPanel) {
      MessageViewerPanel.currentPanel._panel.dispose()
    }
    // If a webview panel does not already exist create and show a new one
    const panel = window.createWebviewPanel(
      'showPreviewClaimset',
      conversation.persona.roleName,
      ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [Uri.joinPath(extensionUri, 'out')],
      }
    )

    MessageViewerPanel.currentPanel = new MessageViewerPanel(
      panel,
      extensionUri
    )

    MessageViewerPanel.currentPanel._conversation = conversation
    MessageViewerPanel.currentPanel._render()
  }

  private _render() {
    if (!this._conversation) return

    // Set the HTML content for the webview panel
    this._panel.webview.html = this._getWebviewContent(
      this._panel.webview,
      this._extensionUri
    )

    MessageViewerPanel.currentPanel?._panel.webview.postMessage({
      command: 'rqstViewRenderMessages',
      text: JSON.stringify(this._conversation.chatMessages),
    })
  }

  /**
   * Cleans up and disposes of webview resources when the webview panel is closed.
   */
  public dispose() {
    MessageViewerPanel.currentPanel = undefined

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

  private _setPanelIcon() {
    const iconPathOnDisk = Uri.joinPath(
      this._extensionUri,
      'assets',
      'openai-webview.png'
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
      'webview-ui',
      'messageWebview',
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
   *    | source		| target		| command									| model						|
   *    |-----------|-----------|-------------------------|-----------------|
   *    | extension	| webview		| rqstViewRenderMessages	| IConversation		|
   *    | extension	| webview		| rqstViewAnswerMessage		| IChatMessage		|
   *    | webview		| extension	| rcvdViewSaveMessages		| IChatMessage[]	|
   *
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'rcvdViewSaveMessages':
            // eslint-disable-next-line no-case-declarations
            const chatMessages: IChatMessage[] = JSON.parse(message.text)
            this._rcvdViewSaveMessages(chatMessages)
            // If the last item was from user
            if (chatMessages[chatMessages.length - 1].mine === true) {
              this._askQuestion()
            }
            return

          default:
            window.showErrorMessage(message.command)
            return
        }
      },
      null,
      this._disposables
    )
  }

  private _rcvdViewSaveMessages(chatMessages: IChatMessage[]) {
    try {
      if (!this._conversation) return

      this._conversation.chatMessages = chatMessages

      //Add summary to conversation
      if (
        this._conversation.chatMessages.length > 5 &&
        this._conversation.summary === '<New Conversation>'
      ) {
        //Deep clone for summary
        const summary = JSON.parse(
          JSON.stringify(this._conversation)
        ) as IConversation
        const chatThread: IChatMessage = {
          content:
            'Summarise the conversation in one sentence. Be as concise as possible and only provide the facts. Start the sentence with the key points. Using no more than 150 characters',
          author: 'summary',
          timestamp: new Date().toLocaleString(),
          mine: false,
        }
        summary.chatMessages.push(chatThread)
        messageCompletion(summary).then((result) => {
          if (!this._conversation) return
          this._conversation.summary = result
        })
      }
      ConversationService.instance.update(this._conversation)
    } catch (error) {
      window.showErrorMessage(error as string)
    }
  }

  private _askQuestion() {
    if (!this._conversation) return

    //Note: rcvdViewSaveMessages has added the new question
    messageCompletion(this._conversation).then((result) => {
      const author = `${this._conversation?.persona.roleName} (${this._conversation?.persona.configuration.service})`
      const chatThread: IChatMessage = {
        content: result,
        author: author,
        timestamp: new Date().toLocaleString(),
        mine: false,
      }
      MessageViewerPanel.currentPanel?._panel.webview.postMessage({
        command: 'rqstViewAnswerMessage',
        text: JSON.stringify(chatThread),
      })
    })
  }
}
