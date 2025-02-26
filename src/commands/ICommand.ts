export interface ICommand {
  readonly id: string

  execute(...args: any[]): void | Promise<void>
}
