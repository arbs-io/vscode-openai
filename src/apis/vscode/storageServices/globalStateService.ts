import { ExtensionContext, Memento } from 'vscode'
import { createErrorNotification } from '@app/apis/node'

export default class GlobalStorageService {
  private static _instance: GlobalStorageService

  constructor(private storage: Memento) {}

  static init(context: ExtensionContext): void {
    try {
      GlobalStorageService._instance = new GlobalStorageService(
        context.globalState
      )
    } catch (error) {
      createErrorNotification(error)
    }
  }

  static get instance(): GlobalStorageService {
    return GlobalStorageService._instance
  }

  public getValue<T>(key: string): T {
    return this.storage.get<T>(key, <T>(<any>undefined))
  }

  public setValue<T>(key: string, value: T) {
    this.storage.update(key, value)
  }

  public deleteKey(key: string) {
    this.storage.update(key, undefined)
  }

  public keys(): readonly string[] {
    return this.storage.keys()
  }
}
