import {
  ColorTheme,
  EventEmitter,
  ExtensionContext,
  window,
  Event,
} from 'vscode'

export function registerSidebarProvider(context: ExtensionContext) {
  window.onDidChangeActiveColorTheme((theme: ColorTheme) => {
    onWillExecuteActionEventEmitter.fire('action')
  })
}

export const onWillExecuteActionEventEmitter: EventEmitter<string> =
  new EventEmitter()

export const onWillExecuteAction: Event<string> =
  onWillExecuteActionEventEmitter.event
