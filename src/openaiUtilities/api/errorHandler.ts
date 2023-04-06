import { commands, window } from 'vscode'
import { ExtensionStatusBarItem } from '../../vscodeUtilities'
import { showMessageWithTimeout } from '../../vscodeUtilities'

export function errorHandler(error: any) {
  if (error.syscall === 'getaddrinfo' && error.errno === -3008) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'server-environment',
      '- unknown host'
    )
    // disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
  } else if (error.response !== undefined && error.response.status === 401) {
    ExtensionStatusBarItem.instance.showStatusBarError(
      'lock',
      '- failed authentication'
    )
    // disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)
  } else if (error.response !== undefined && error.response.status === 404) {
    ExtensionStatusBarItem.instance.showStatusBarError('cloud', '- not found')
    showMessageWithTimeout(
      'Resource not found: check baseurl, api version or deployment name',
      7500
    )
  } else {
    showMessageWithTimeout(
      `unexpected error occured: ${error.code}, Please help and report issue to github issue. Providing operation and configuration setup (excluding any sensitive data)`,
      15000
    )
  }
}
