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
  workspace,
} from 'vscode'
import { getUri, getNonce } from '@app/utilities/vscode'
import { IChatCompletion, IConversation } from '@app/interfaces'
import { ResponseFormat, createChatCompletion } from '@app/utilities/openai'
import { ConversationService } from '@app/services'

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
      'webview-ui',
      'messageWebview',
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
   *    | extension	| webview		| rqstViewAnswerMessage		| IChatCompletion		|
   *    | webview		| extension	| rcvdViewSaveMessages		| IChatCompletion[]	|
   *    | webview		| extension	| rqstViewCreateDocument	| string					|
   *
   */
  private _setWebviewMessageListener(webview: Webview) {
    webview.onDidReceiveMessage(
      (message) => {
        switch (message.command) {
          case 'rcvdViewSaveMessages': {
            const chatMessages: IChatCompletion[] = JSON.parse(message.text)
            this._rcvdViewSaveMessages(chatMessages)
            // If the last item was from user
            if (chatMessages[chatMessages.length - 1].mine === true) {
              this._askQuestion()
            }
            return
          }
          case 'rqstViewCreateDocument': {
            const codeDocument: ICodeDocument = JSON.parse(message.text)
            workspace
              .openTextDocument({
                content: codeDocument.content,
                language: codeDocument.language,
              })
              .then((doc) =>
                window.showTextDocument(doc, {
                  preserveFocus: true,
                  preview: false,
                  viewColumn: ViewColumn.Beside,
                })
              )
            return
          }

          default:
            window.showErrorMessage(message.command)
            return
        }
      },
      null,
      this._disposables
    )
  }

  private _rcvdViewSaveMessages(chatMessages: IChatCompletion[]) {
    try {
      if (!this._conversation) return

      this._conversation.chatMessages = chatMessages
      ConversationService.instance.update(this._conversation)

      this._addSummary()
    } catch (error) {
      window.showErrorMessage(error as string)
    }
  }

  private _addSummary() {
    if (!this._conversation) return

    //Add summary to conversation
    if (
      this._conversation.chatMessages.length > 5 &&
      this._conversation.summary === '<New Conversation>'
    ) {
      //Deep clone for summary
      const summary = JSON.parse(
        JSON.stringify(this._conversation)
      ) as IConversation
      const chatCompletion: IChatCompletion = {
        content:
          'Summarise the conversation in one sentence. Be as concise as possible and only provide the facts. Start the sentence with the key points. Using no more than 150 characters',
        author: 'summary',
        timestamp: new Date().toLocaleString(),
        mine: false,
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      }
      summary.chatMessages.push(chatCompletion)
      createChatCompletion(summary, ResponseFormat.Markdown).then((result) => {
        if (!this._conversation) return
        if (result?.content) this._conversation.summary = result?.content
      })
    }
  }

  private _askQuestion() {
    if (!this._conversation) return

    //Note: rcvdViewSaveMessages has added the new question
    createChatCompletion(this._conversation, ResponseFormat.Markdown).then(
      (result) => {
        if (!result) return

        const author = `${this._conversation?.persona.roleName} (${this._conversation?.persona.configuration.service})`
        const chatCompletion: IChatCompletion = {
          content: result.content,
          author: author,
          timestamp: new Date().toLocaleString(),
          mine: false,
          completionTokens: result.completionTokens,
          promptTokens: result.promptTokens,
          totalTokens: result.totalTokens,
        }
        MessageViewerPanel.currentPanel?._panel.webview.postMessage({
          command: 'rqstViewAnswerMessage',
          text: JSON.stringify(chatCompletion),
        })
      }
    )
  }
}

interface ICodeDocument {
  language: string
  content: string
}
