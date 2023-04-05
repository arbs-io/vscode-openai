import { commands, window } from 'vscode'
import {
  ExtensionStatusBarItem
} from '../../vscodeUtilities'
import { showMessageWithTimeout } from '../../vscodeUtilities'


export function errorHandler(error: any) {
    //Always disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

    if(error.syscall === "getaddrinfo" && error.errno === -3008) {
      ExtensionStatusBarItem.instance.showStatusBarError('server-environment', '- unknown host')
    }
    else if (error.response !== undefined && error.response.status === 401) {
      ExtensionStatusBarItem.instance.showStatusBarError('lock', '- failed authentication')
    }
    else if (error.response !== undefined && error.response.status === 404) {
      ExtensionStatusBarItem.instance.showStatusBarError('cloud', '- not found')
      showMessageWithTimeout("Resource not found: check baseurl, api version or deployment name", 5000)
    }
    else {
      console.log(error.code)
    }  
}
