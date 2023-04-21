import { OutputChannel, window, workspace } from 'vscode'

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
    const logMessage = `${getTimeAndms()} [debug] ${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
  }
}

export function logInfo(message: string): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string

  if (logLevel === 'Info' || logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [info] ${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
  }
}

export function logError(error: any): void {
  const logMessage = `${getTimeAndms()} [error] ${error.toString()}`.replace(
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
