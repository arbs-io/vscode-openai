import { commands } from 'vscode'
import { ExtensionStatusBarItem, logError } from '@app/utilities/vscode'
import { VSCODE_OPENAI_EXTENSION } from '@app/contexts'

interface IStatusBarItem {
  icon: string
  message: string
}

export function errorHandler(error: any) {
  logError(error.message)

  if (
    error.syscall !== undefined &&
    error.syscall === 'getaddrinfo' &&
    error.errno === -3008
  ) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'server-environment',
      `- unknown host`,
      error.hostname
    )
    // disable extension when exception occurs
    commands.executeCommand(
      'setContext',
      VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID,
      false
    )
    return
  }

  if (error.response !== undefined) {
    const statusBarItem = responseErrorHandler(error)
    ExtensionStatusBarItem.instance.showStatusBarError(
      statusBarItem.icon,
      statusBarItem.message
    )
    return
  }
}

export function responseErrorHandler(error: any): IStatusBarItem {
  switch (error.response.status as number) {
    case 401: {
      const statusBarItem: IStatusBarItem = {
        icon: 'lock',
        message: '- failed authentication',
      }
      return statusBarItem
    }

    case 404: {
      const statusBarItem: IStatusBarItem = {
        icon: 'cloud',
        message: '- not found',
      }
      return statusBarItem
    }

    case 429: {
      const statusBarItem: IStatusBarItem = {
        icon: 'exclude',
        message: '- rate limit',
      }
      return statusBarItem
    }

    default: {
      const statusBarItem: IStatusBarItem = {
        icon: 'error',
        message: `- (${error.response.status}) ${error.response.statusText}`,
      }
      return statusBarItem
    }
  }
}
