import { EventEmitter, Event } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IEmbeddingFileLite } from '@app/interfaces'
import { createErrorNotification } from '@app/utilities/node'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'

export default class EmbeddingService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: EmbeddingService

  constructor(private _embeddings: Array<IEmbeddingFileLite>) {}

  static init(): void {
    try {
      const embeddings = EmbeddingService.loadEmbeddings()
      EmbeddingService._instance = new EmbeddingService(embeddings)
    } catch (error) {
      createErrorNotification(error)
    }
  }

  private static loadEmbeddings(): Array<IEmbeddingFileLite> {
    // //For development (remove all keys...)
    // GlobalStorageService.instance.keys().forEach((key) => {
    //   if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-`)) {
    //     GlobalStorageService.instance.deleteKey(key)
    //   }
    // })

    const embeddings: Array<IEmbeddingFileLite> = []
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-`)) {
        const embedding =
          GlobalStorageService.instance.getValue<IEmbeddingFileLite>(key)
        if (embedding !== undefined) {
          embeddings.push(embedding)
        }
      }
    })
    return embeddings
  }

  static get instance(): EmbeddingService {
    return EmbeddingService._instance
  }

  public getAll(): Array<IEmbeddingFileLite> {
    return this._embeddings.sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public get(key: string): IEmbeddingFileLite | undefined {
    return this._embeddings.find((item) => item.embeddingId === key)
    // this._embeddings.forEach((embedding) => {
    //   if (key === embedding.embeddingId) {
    //     return embedding
    //   }
    // })
    // return undefined
  }

  public delete(key: string) {
    this._delete(key)
    EmbeddingService._emitterDidChange.fire()
  }

  private _delete(key: string) {
    this._embeddings.forEach((item, index) => {
      if (item.embeddingId === key) this._embeddings.splice(index, 1)
    })
    GlobalStorageService.instance.deleteKey(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${key}`
    )
  }

  public update(embedding: IEmbeddingFileLite) {
    this._update(embedding)
    EmbeddingService._emitterDidChange.fire()
  }

  private _update(embedding: IEmbeddingFileLite) {
    this._delete(embedding.embeddingId)
    GlobalStorageService.instance.setValue<IEmbeddingFileLite>(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${embedding.embeddingId}`,
      embedding
    )
    this._embeddings.push(embedding)
  }
}
