import { ExtensionStatusBarItem, setFeatureFlag } from '@app/utilities/vscode'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'
import { createErrorNotification } from '@app/utilities/node'

interface IStatusBarItem {
  icon: string
  message: string
  isError: boolean
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
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
    createErrorNotification(error)
    return
  }

  if (error.response !== undefined) {
    const statusBarItem = handleResponse(error)
    if (statusBarItem.isError) {
      createErrorNotification(error)

      ExtensionStatusBarItem.instance.showStatusBarError(
        statusBarItem.icon,
        statusBarItem.message
      )
    } else {
      // createWarningNotification(statusBarItem.message.split('- ').join(''))
      ExtensionStatusBarItem.instance.showStatusBarWarning(
        statusBarItem.icon,
        statusBarItem.message
      )
    }

    return
  }
}

export function handleResponse(error: any): IStatusBarItem {
  switch (error.response.status as number) {
    case 401: {
      const statusBarItem: IStatusBarItem = {
        icon: 'lock',
        message: '- failed authentication',
        isError: true,
      }
      return statusBarItem
    }

    case 400: {
      const statusBarItem: IStatusBarItem = {
        icon: 'exclude',
        message: '- token limits',
        isError: false,
      }
      return statusBarItem
    }

    case 404: {
      const statusBarItem: IStatusBarItem = {
        icon: 'cloud',
        message: '- not found',
        isError: false,
      }
      return statusBarItem
    }

    case 429: {
      const statusBarItem: IStatusBarItem = {
        icon: 'exclude',
        message: '- rate limit',
        isError: false,
      }
      return statusBarItem
    }

    default: {
      const statusBarItem: IStatusBarItem = {
        icon: 'error',
        message: `- (${error.response.status}) ${error.response.statusText}`,
        isError: true,
      }
      return statusBarItem
    }
  }
}
