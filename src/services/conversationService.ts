import * as crypto from 'crypto'
import { EventEmitter, Event, ExtensionContext } from 'vscode'
import { GlobalStorageService } from '../utilities/vscode'
import { IChatCompletion, IConversation, IPersonaOpenAI } from '../interfaces'
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

  public create(persona: IPersonaOpenAI): IConversation {
    const uuid4 = crypto.randomUUID()

    const chatThreads: IChatCompletion[] = []
    chatThreads.push({
      content: `Welcome! I'm vscode-openai, an AI language model based on OpenAI. I have been designed to assist you with all your technology needs. Whether you're looking for help with programming, troubleshooting technical issues, or just want to stay up-to-date with the latest developments in the industry, I'm here to provide the information you need.`,
      author: `${persona.roleName} (${persona.configuration.service})`,
      timestamp: new Date().toLocaleString(),
      mine: false,
      completionTokens: 0,
      promptTokens: 0,
      totalTokens: 0,
    })

    const conversation: IConversation = {
      timestamp: new Date().getTime(),
      conversationId: uuid4,
      persona: persona,
      summary: '<New Conversation>',
      chatMessages: chatThreads,
    }
    return conversation
  }
}
