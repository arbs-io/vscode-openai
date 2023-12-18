import { v4 as uuidv4 } from 'uuid'
import { EventEmitter, Event, ExtensionContext } from 'vscode'
import { GlobalStorageService } from '@app/apis/vscode'
import { IConversation, IPersonaOpenAI } from '@app/types'
import { MessageViewerPanel } from '@app/panels'
import {
  createDebugNotification,
  createErrorNotification,
} from '@app/apis/node'
import {
  VSCODE_OPENAI_CONVERSATION,
  VSCODE_OPENAI_EMBEDDING,
} from '@app/constants'
import { EmbeddingStorageService } from '..'

export default class ConversationStorageService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChangeConversationStorage: Event<void> =
    ConversationStorageService._emitterDidChange.event
  private static _instance: ConversationStorageService
  private static readonly storagePrefix = `${VSCODE_OPENAI_CONVERSATION.STORAGE_V1_ID}-`

  constructor(private _context: ExtensionContext) {}

  static init(context: ExtensionContext): void {
    try {
      ConversationStorageService.houseKeeping()
      ConversationStorageService._instance = new ConversationStorageService(
        context
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }

  private static houseKeeping() {
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key === ConversationStorageService.storagePrefix + 'undefined') {
        GlobalStorageService.instance.deleteKey(key)
      }
    })
  }

  static get instance(): ConversationStorageService {
    return ConversationStorageService._instance
  }

  public refresh() {
    ConversationStorageService._emitterDidChange.fire()
  }

  public getAll(): Array<IConversation> {
    return GlobalStorageService.instance
      .keys()
      .filter((key) => key.startsWith(ConversationStorageService.storagePrefix))
      .map((key) => GlobalStorageService.instance.getValue<IConversation>(key))
      .filter(
        (conversation): conversation is IConversation =>
          conversation !== undefined
      )
      .sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public show(conversationId: string) {
    const conversationKey =
      ConversationStorageService.storagePrefix + conversationId
    const conversation =
      GlobalStorageService.instance.getValue<IConversation>(conversationKey)
    if (conversation)
      MessageViewerPanel.render(this._context.extensionUri, conversation)
  }

  public deleteAll() {
    GlobalStorageService.instance
      .keys()
      .filter((key) => key.startsWith(ConversationStorageService.storagePrefix))
      .forEach((key) => {
        GlobalStorageService.instance.deleteKey(key)
        createDebugNotification(
          `Deleting conversation: ${key.substring(
            ConversationStorageService.storagePrefix.length
          )}`
        )
      })
    ConversationStorageService._emitterDidChange.fire()
  }

  public delete(conversationId: string) {
    const conversationKey =
      ConversationStorageService.storagePrefix + conversationId
    GlobalStorageService.instance.deleteKey(conversationKey)
    ConversationStorageService._emitterDidChange.fire()
  }

  public update(conversation: IConversation) {
    const conversationKey =
      ConversationStorageService.storagePrefix + conversation.conversationId
    GlobalStorageService.instance.deleteKey(conversationKey)
    GlobalStorageService.instance.setValue<IConversation>(
      conversationKey,
      conversation
    )
    ConversationStorageService._emitterDidChange.fire()
  }

  public async create(
    persona: IPersonaOpenAI,
    embeddingId?: string
  ): Promise<IConversation> {
    const uuid4 = uuidv4()
    const welcomeMessage = embeddingId
      ? await this.getEmbeddingWelcomeMessage(embeddingId)
      : await this.getWelcomeMessage()
    const summary = embeddingId
      ? `Query ${(await this.getEmbeddingSummary(embeddingId)).toUpperCase()}`
      : '<New Conversation>'

    const chatCompletion = [
      {
        content: welcomeMessage,
        author: `${persona.roleName} (${persona.configuration.service})`,
        timestamp: new Date().toLocaleString(),
        mine: false,
        completionTokens: 0,
        promptTokens: 0,
        totalTokens: 0,
      },
    ]

    return {
      timestamp: new Date().getTime(),
      conversationId: uuid4,
      persona: persona,
      embeddingId: embeddingId,
      summary: summary,
      chatMessages: chatCompletion,
    }
  }

  private async getWelcomeMessage(): Promise<string> {
    return "Welcome! I'm vscode-openai, an AI language model based on OpenAI. I have been designed to assist you with all your technology needs. Whether you're looking for help with programming, troubleshooting technical issues, or just want to stay up-to-date with the latest developments in the industry, I'm here to provide the information you need."
  }
  private async getEmbeddingWelcomeMessage(
    embeddingId: string
  ): Promise<string> {
    let content =
      'Welcome to resource query. This conversation will be scoped to the following resources'

    // If we use the "special key" we're using all resources
    if (embeddingId === VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL) {
      const allEmbeddings = (
        await EmbeddingStorageService.instance.getAll()
      ).map((embedding) => {
        return embedding.name
      })
      content = content + `\n- ${allEmbeddings.join('\n- ')}`
    } else {
      const embedding = await EmbeddingStorageService.instance.get(embeddingId)
      content = content + `\n- ${embedding?.name}`
    }
    return content
  }

  private async getEmbeddingSummary(embeddingId: string): Promise<string> {
    if (embeddingId === VSCODE_OPENAI_EMBEDDING.RESOURCE_QUERY_ALL) {
      return 'all-resources'
    } else {
      const embedding = await EmbeddingStorageService.instance.get(embeddingId)
      return embedding?.name ?? ''
    }
  }
}
