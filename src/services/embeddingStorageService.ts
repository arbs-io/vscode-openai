import { EventEmitter, Event } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IEmbeddingFileLite } from '@app/interfaces'
import { createErrorNotification } from '@app/utilities/node'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'

export default class EmbeddingStorageService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: EmbeddingStorageService

  static get instance(): EmbeddingStorageService {
    if (!this._instance) {
      try {
        EmbeddingStorageService._instance = new EmbeddingStorageService()
      } catch (error) {
        createErrorNotification(error)
      }
    }
    return this._instance
  }

  public getAll(): Array<IEmbeddingFileLite> {
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
    return embeddings.sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public get(key: string): IEmbeddingFileLite | undefined {
    const embedding =
      GlobalStorageService.instance.getValue<IEmbeddingFileLite>(
        `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${key}`
      )
    return embedding
  }

  public delete(key: string) {
    this._delete(key)
    EmbeddingStorageService._emitterDidChange.fire()
  }

  private _delete(key: string) {
    GlobalStorageService.instance.deleteKey(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${key}`
    )
  }

  public update(embedding: IEmbeddingFileLite) {
    this._update(embedding)
    EmbeddingStorageService._emitterDidChange.fire()
  }

  private _update(embedding: IEmbeddingFileLite) {
    this._delete(embedding.embeddingId)
    GlobalStorageService.instance.setValue<IEmbeddingFileLite>(
      `${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-${embedding.embeddingId}`,
      embedding
    )
  }
}
