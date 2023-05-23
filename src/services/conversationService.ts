import * as crypto from 'crypto'
import { EventEmitter, Event, ExtensionContext } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IChatCompletion, IConversation, IPersonaOpenAI } from '@app/interfaces'
import { MessageViewerPanel } from '@app/panels'
import { createErrorNotification } from '@app/utilities/node'
import { VSCODE_OPENAI_CONVERSATION } from '@app/contexts'

export default class ConversationService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: ConversationService

  constructor(
    private _context: ExtensionContext,
    private _conversations: Array<IConversation>
  ) {}

  static init(context: ExtensionContext): void {
    try {
      const conversations = ConversationService.loadConversations()
      ConversationService._instance = new ConversationService(
        context,
        conversations
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }

  private static loadConversations(): Array<IConversation> {
    const conversations: Array<IConversation> = []
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith(`${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-`)) {
        const conversation =
          GlobalStorageService.instance.getValue<IConversation>(key)
        if (conversation !== undefined) {
          conversations.push(conversation)
        }
      }
    })
    return conversations
  }

  static get instance(): ConversationService {
    return ConversationService._instance
  }

  public getAll(): Array<IConversation> {
    return this._conversations.sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public show(key: string) {
    this._conversations.forEach((conversation) => {
      if (key === conversation.conversationId) {
        MessageViewerPanel.render(this._context.extensionUri, conversation)
      }
    })
  }

  public delete(key: string) {
    this._delete(key)
    ConversationService._emitterDidChange.fire()
  }

  private _delete(key: string) {
    this._conversations.forEach((item, index) => {
      if (item.conversationId === key) this._conversations.splice(index, 1)
    })
    GlobalStorageService.instance.deleteKey(
      `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${key}`
    )
  }

  public update(conversation: IConversation) {
    this._update(conversation)
    ConversationService._emitterDidChange.fire()
  }

  private _update(conversation: IConversation) {
    this._delete(conversation.conversationId)
    GlobalStorageService.instance.setValue<IConversation>(
      `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-${conversation.conversationId}`,
      conversation as IConversation
    )
    this._conversations.push(conversation)
  }

  public create(persona: IPersonaOpenAI): IConversation {
    const uuid4 = crypto.randomUUID()

    const chatCompletion: IChatCompletion[] = []
    chatCompletion.push({
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
      chatMessages: chatCompletion,
    }
    return conversation
  }
}
