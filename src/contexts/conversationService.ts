import * as crypto from 'crypto'
import { EventEmitter, Event, ExtensionContext } from 'vscode'
import { GlobalStorageService } from '../vscodeUtilities'
import { IConversation, IPersonaOpenAI } from '../interfaces'
import { MessageViewerPanel } from '../panels'

export default class ConversationService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: ConversationService

  constructor(
    private vscodeContext: ExtensionContext,
    private conversations: Array<IConversation>
  ) {}

  static init(context: ExtensionContext): void {
    const conversations = ConversationService.loadConversations()
    ConversationService._instance = new ConversationService(
      context,
      conversations
    )
  }

  private static loadConversations(): Array<IConversation> {
    const convs: Array<IConversation> = []
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith('conversation-')) {
        const conversation =
          GlobalStorageService.instance.getValue<IConversation>(key)
        if (conversation !== undefined) {
          // this.instance.addConversation(conversation)
          convs.push(conversation)
        }
      }
    })
    return convs
  }

  static get instance(): ConversationService {
    return ConversationService._instance
  }

  public getAll(): Array<IConversation> {
    return this.conversations.sort((n1, n2) => n1.timestamp - n2.timestamp)
  }

  public show(key: string) {
    this.conversations.forEach((conversation) => {
      if (key === conversation.conversationId) {
        MessageViewerPanel.render(this.vscodeContext.extensionUri, conversation)
      }
    })
  }

  public delete(key: string) {
    this.conversations.forEach((item, index) => {
      if (item.conversationId === key) this.conversations.splice(index, 1)
    })
    GlobalStorageService.instance.deleteKey(`conversation-${key}`)
    ConversationService._emitterDidChange.fire()
  }

  public update(conversation: IConversation) {
    this.delete(conversation.conversationId)
    GlobalStorageService.instance.setValue<IConversation>(
      `conversation-${conversation.conversationId}`,
      conversation as IConversation
    )
    this.conversations.push(conversation)
    ConversationService._emitterDidChange.fire()
  }

  public create(persona: IPersonaOpenAI) {
    const uuid4 = crypto.randomUUID()
    const conversation: IConversation = {
      timestamp: new Date().getTime(),
      conversationId: uuid4,
      persona: persona,
      summary: '<New Conversation>',
      chatMessages: [],
    }

    GlobalStorageService.instance.setValue<IConversation>(
      `conversation-${conversation.conversationId}`,
      conversation as IConversation
    )
    this.conversations.push(conversation)
    this.show(conversation.conversationId)
    ConversationService._emitterDidChange.fire()
  }
}

/**
   *
   * Event Model: personaWebviewProvider
   *    | source		| target		| command												| model						|
   *    |-----------|-----------|-------------------------------|-----------------|
   *    | extension	| webview		| rqstViewLoadPersonas					| IPersonaOpenAI[]	|
   *    | webview		| extension	| rcvdViewNewConversation				| IPersonaOpenAI		|
   *
   * Event Model: conversationsWebviewProvider
   *    | source		| target		| command												| model						|
   *    |-----------|-----------|-------------------------------|-----------------|
   *    | extension	| webview		| rqstViewLoadConversations			| IConversation[]	|
   *    | webview		| extension	| rcvdViewDeleteConversation		| IConversation		|
   *
   * Event Model: MessageViewerPanel
   *    | source		| target		| command												| model						|
   *    |-----------|-----------|-------------------------------|-----------------|
   *    | extension	| webview		| rqstViewRenderMessages				| IConversation		|
   *    | extension	| webview		| rqstViewAnswerMessage					| IChatMessage		|
   *    | webview		| extension	| rcvdViewSaveMessages					| IChatMessage[]	|
   *    | webview		| extension	| rcvdViewQuestionMessage				| IChatMessage		|
   *

  Conversations
  - New
  - Delete(key)

  Conversation
  - newQuestion
  - onQuestionAnswered

  */
