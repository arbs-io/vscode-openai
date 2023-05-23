import * as crypto from 'crypto'
import { EventEmitter, Event, ExtensionContext, Uri } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IEmbedding } from '@app/interfaces'
import { createErrorNotification } from '@app/utilities/node'

export default class EmbeddingService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: EmbeddingService

  constructor(private _embeddings: Array<IEmbedding>) {}

  static init(): void {
    try {
      const embeddings = EmbeddingService.loadConversations()
      EmbeddingService._instance = new EmbeddingService(embeddings)
    } catch (error) {
      createErrorNotification(error)
    }
  }

  private static loadConversations(): Array<IEmbedding> {
    const embeddings: Array<IEmbedding> = []
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith('embedding.v1-')) {
        const conversation =
          GlobalStorageService.instance.getValue<IEmbedding>(key)
        if (conversation !== undefined) {
          embeddings.push(conversation)
        }
      }
    })
    return embeddings
  }

  static get instance(): EmbeddingService {
    return EmbeddingService._instance
  }

  public getAll(): Array<IEmbedding> {
    return this._embeddings.sort((n1, n2) => n1.timestamp - n2.timestamp)
  }

  public delete(key: string) {
    this._delete(key)
    EmbeddingService._emitterDidChange.fire()
  }

  private _delete(key: string) {
    this._embeddings.forEach((item, index) => {
      if (item.embeddingId === key) this._embeddings.splice(index, 1)
    })
    GlobalStorageService.instance.deleteKey(`conversation-${key}`)
  }

  public update(conversation: IEmbedding) {
    this._update(conversation)
    EmbeddingService._emitterDidChange.fire()
  }

  private _update(conversation: IEmbedding) {
    this._delete(conversation.embeddingId)
    GlobalStorageService.instance.setValue<IEmbedding>(
      `conversation-${conversation.embeddingId}`,
      conversation as IEmbedding
    )
    this._embeddings.push(conversation)
  }

  public create(uri: Uri, content: string): IEmbedding {
    const uuid4 = crypto.randomUUID()

    const conversation: IEmbedding = {
      timestamp: new Date().getTime(),
      embeddingId: uuid4,
      uri: uri,
      content: content,
    }
    return conversation
  }
}
