import { commands, window } from 'vscode'
import {
  ExtensionStatusBarItem,
  showMessageWithTimeout,
} from '@app/utilities/vscode'

interface IStatusBarItem {
  icon: string
  message: string
}

export function errorHandler(error: any) {
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
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
    return
  }

  if (error.response !== undefined) {
    const statusBarItem = responseErrorHandler(error)
    ExtensionStatusBarItem.instance.showStatusBarError(
      statusBarItem.icon,
      statusBarItem.message
    )
    showMessageWithTimeout(
      `${error.response.status} ${error.response.statusText}`,
      10000
    )
    return
  }

  delete error.stack
  const reportError = JSON.stringify(error)
  window.showErrorMessage(
    `unexpected error: Please report issue to github (remove any sensitive data). ${reportError}`
  )
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
