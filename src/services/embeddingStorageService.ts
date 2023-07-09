import { workspace, EventEmitter, Event, ExtensionContext, Uri } from 'vscode'
import { GlobalStorageService } from '@app/utilities/vscode'
import { IEmbeddingFileLite } from '@app/interfaces'
import {
  createDebugNotification,
  createErrorNotification,
  noop,
} from '@app/utilities/node'
import { VSCODE_OPENAI_EMBEDDING } from '@app/constants'

export default class EmbeddingStorageService {
  private static _emitterDidChange = new EventEmitter<void>()
  static readonly onDidChange: Event<void> = this._emitterDidChange.event

  private static _instance: EmbeddingStorageService

  constructor(private _context: ExtensionContext) {}
  static init(context: ExtensionContext): void {
    try {
      EmbeddingStorageService._instance = new EmbeddingStorageService(context)

      //Create extension folder andrewbutson.vscode-openai
      workspace.fs.createDirectory(context.globalStorageUri).then(noop, noop)
      EmbeddingStorageService._upgradeV1()
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): EmbeddingStorageService {
    return EmbeddingStorageService._instance
  }

  public async getAll(): Promise<IEmbeddingFileLite[]> {
    const embeddings: IEmbeddingFileLite[] = []
    const keys = GlobalStorageService.instance.keys()

    for (const key of keys) {
      if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V2_ID}-`)) {
        const embedding = await this.get(
          key.replace(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V2_ID}-`, '')
        )
        embeddings.push(embedding!)
      }
    }

    return embeddings.sort((n1, n2) => n2.timestamp - n1.timestamp)
  }

  public async get(
    embeddingId: string
  ): Promise<IEmbeddingFileLite | undefined> {
    const key = `${VSCODE_OPENAI_EMBEDDING.STORAGE_V2_ID}-${embeddingId}`
    const keyPath = Uri.joinPath(this._context.globalStorageUri, key)

    const readData = await workspace.fs.readFile(keyPath)
    const readStr = Buffer.from(readData).toString('utf8')
    const embeddingFileLite: IEmbeddingFileLite = JSON.parse(readStr)
    return embeddingFileLite
  }

  public delete(embeddingId: string) {
    this._delete(embeddingId)
    EmbeddingStorageService._emitterDidChange.fire()
  }

  private _delete(embeddingId: string) {
    const key = `${VSCODE_OPENAI_EMBEDDING.STORAGE_V2_ID}-${embeddingId}`
    const keyPath = Uri.joinPath(this._context.globalStorageUri, key)
    workspace.fs.delete(keyPath)

    GlobalStorageService.instance.deleteKey(key)
  }

  public update(embedding: IEmbeddingFileLite) {
    this._update(embedding)
    EmbeddingStorageService._emitterDidChange.fire()
  }

  private _update(embedding: IEmbeddingFileLite) {
    this._delete(embedding.embeddingId)

    const key = `${VSCODE_OPENAI_EMBEDDING.STORAGE_V2_ID}-${embedding.embeddingId}`
    const keyPath = Uri.joinPath(this._context.globalStorageUri, key)
    const encoded = new TextEncoder().encode(JSON.stringify(embedding))
    workspace.fs.writeFile(keyPath, encoded)

    GlobalStorageService.instance.setValue<string>(key, key)
  }

  private static _upgradeV1() {
    const keys = GlobalStorageService.instance.keys()
    keys.forEach((key) => {
      if (key.startsWith(`${VSCODE_OPENAI_EMBEDDING.STORAGE_V1_ID}-`)) {
        const embedding =
          GlobalStorageService.instance.getValue<IEmbeddingFileLite>(key)
        if (embedding !== undefined) {
          createDebugNotification(`migrating embedding v1 -> v2: ${key}`)
          EmbeddingStorageService.instance._update(embedding)
          GlobalStorageService.instance.deleteKey(key)
          //TODO Delete the storage item
        }
      }
    })
  }
}
