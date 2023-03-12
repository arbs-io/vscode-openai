import { ExtensionContext, Memento } from 'vscode'

export default class LocalStorageService {
  private static _instance: LocalStorageService

  constructor(private storage: Memento) {}

  static init(context: ExtensionContext): void {
    LocalStorageService._instance = new LocalStorageService(
      context.workspaceState
    )
  }

  static get instance(): LocalStorageService {
    return LocalStorageService._instance
  }

  public getValue<T>(key: string): T {
    return this.storage.get<T>(key, <T>(<any>undefined))
  }

  public setValue<T>(key: string, value: T) {
    this.storage.update(key, value)
  }
}
