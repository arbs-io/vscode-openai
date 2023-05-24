import { EventEmitter, Event } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IEmbedding } from '@app/interfaces'
import { createErrorNotification } from '@app/utilities/node'
import { VSCODE_OPENAI_EMBEDDING } from '@app/contexts'

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
    //For development (remove all keys...)
    GlobalStorageService.instance.keys().forEach((key) => {
      if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-`)) {
        GlobalStorageService.instance.deleteKey(key)
      }
    })

    const embeddings: Array<IEmbedding> = []
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-`)) {
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
    return this._embeddings.sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public delete(key: string) {
    this._delete(key)
    EmbeddingService._emitterDidChange.fire()
  }

  private _delete(key: string) {
    this._embeddings.forEach((item, index) => {
      GlobalStorageService.instance.deleteKey(
        `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${item.embeddingId}`
      )
    })

    this._embeddings.forEach((item, index) => {
      if (item.embeddingId === key) this._embeddings.splice(index, 1)
    })
    GlobalStorageService.instance.deleteKey(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${key}`
    )
  }

  public update(conversation: IEmbedding) {
    this._update(conversation)
    EmbeddingService._emitterDidChange.fire()
  }

  private _update(conversation: IEmbedding) {
    this._delete(conversation.embeddingId)
    GlobalStorageService.instance.setValue<IEmbedding>(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${conversation.embeddingId}`,
      conversation as IEmbedding
    )
    this._embeddings.push(conversation)
  }
}
