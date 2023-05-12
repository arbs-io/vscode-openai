import { ExtensionContext, OutputChannel, window, workspace } from 'vscode'
import { VSCODE_OPENAI_EXTENSION } from '@app/contexts'

class OutputChannelFactory {
  private static outLogChannel: OutputChannel

  public static getLogChannel(): OutputChannel {
    if (!OutputChannelFactory.outLogChannel) {
      OutputChannelFactory.outLogChannel = window.createOutputChannel(
        'vscode-openai',
        'vscode-openai-log'
      )
    }
    return OutputChannelFactory.outLogChannel
  }
}

export function logDebug(message: string): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string

  if (logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [debug]\t\t${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
  }
}

export function logInfo(message: string): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string

  if (logLevel === 'Info' || logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [info]\t\t${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
  }
}

export function logWarning(warning: any): void {
  const logMessage =
    `${getTimeAndms()} [warning]\t${warning.toString()}`.replace(
      /(\r\n|\n|\r)/gm,
      ''
    )
  OutputChannelFactory.getLogChannel().appendLine(logMessage)
  OutputChannelFactory.getLogChannel().show()
}

export function logError(error: Error): void {
  const logMessage = `${getTimeAndms()} [error]\t\t${error.toString()}`.replace(
    /(\r\n|\n|\r)/gm,
    ''
  )
  OutputChannelFactory.getLogChannel().appendLine(logMessage)
  OutputChannelFactory.getLogChannel().show()
}

function getTimeAndms(): string {
  const dt = new Date()
  const output = dt.toISOString().replace('T', ' ').replace('Z', '')
  return `${output}`
}

export function showInfo(message: string): void {
  OutputChannelFactory.getLogChannel().clear()
  OutputChannelFactory.getLogChannel().appendLine(message)
  OutputChannelFactory.getLogChannel().show()
}
