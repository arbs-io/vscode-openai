import { StatusBarServiceProvider, setFeatureFlag } from '@app/apis/vscode'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'
import { createErrorNotification } from '@app/apis/node'

interface IStatusBarItem {
  icon: string
  message: string
  isError: boolean
}

export function errorHandler(error: any) {
  createErrorNotification(error)

  if (error.message == 'Connection error.') {
    StatusBarServiceProvider.instance.showStatusBarError(
      'server-environment',
      `- unknown host`,
      error.hostname
    )
    setFeatureFlag(VSCODE_OPENAI_EXTENSION.ENABLED_COMMAND_ID, false)
    return
  }

  const statusBarItem = handleResponse(error)
  if (statusBarItem.isError) {
    StatusBarServiceProvider.instance.showStatusBarError(
      statusBarItem.icon,
      statusBarItem.message
    )
    return
  } else if (statusBarItem) {
    StatusBarServiceProvider.instance.showStatusBarWarning(
      statusBarItem.icon,
      statusBarItem.message
    )
  }
  StatusBarServiceProvider.instance.showStatusBarWarning('error', error.message)
}

export function handleResponse(error: any): IStatusBarItem {
  switch (error.status as number) {
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
