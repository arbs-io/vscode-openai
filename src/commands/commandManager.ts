import { commands, Disposable } from 'vscode'

export interface Command {
  readonly id: string

  execute(...args: any[]): void
}

export class CommandManager {
  private readonly _commands = new Map<string, Disposable>()

  public dispose() {
    for (const registration of this._commands.values()) {
      registration.dispose()
    }
    this._commands.clear()
  }

  public register<T extends Command>(command: T): Disposable {
    this._registerCommand(command.id, command.execute, command)
    return new Disposable(() => {
      this._commands.delete(command.id)
    })
  }

  private _registerCommand(
    id: string,
    impl: (...args: any[]) => void,
    thisArg?: any
  ) {
    if (this._commands.has(id)) {
      return
    }

    this._commands.set(id, commands.registerCommand(id, impl, thisArg))
  }
}
