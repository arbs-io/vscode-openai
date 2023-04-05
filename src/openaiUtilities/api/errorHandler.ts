import { commands, window } from 'vscode'
import {
  ExtensionStatusBarItem
} from '../../vscodeUtilities'


export function errorHandler(error: any) {
    //Always disable extension when exception occurs
    commands.executeCommand('setContext', 'vscode-openai.context.apikey', false)

    if(error.syscall === "getaddrinfo" && error.errno === -3008) {
      ExtensionStatusBarItem.instance.showStatusBarError('lock', '- unknown host')
    }
    else if (error.response !== undefined && error.response.status === 401) {
      ExtensionStatusBarItem.instance.showStatusBarError('lock', '- failed authentication')
    }
    else if (error.response !== undefined && error.response.status === 404) {
      ExtensionStatusBarItem.instance.showStatusBarError('lock', '- not found')
      window.showErrorMessage("Resource not found: check api version or deployment name")
    }
    else {
      console.log(error.code)
    }  
}
