import { ExtensionContext, OutputChannel, window, workspace } from 'vscode'
import TelemetryReporter from '@vscode/extension-telemetry'
import { VSCODE_OPENAI_EXTENSION } from '@app/contexts'

class OutputChannelFactory {
  private static outLogChannel: OutputChannel
  private static telemetryReporter: TelemetryReporter

  public static getLogChannel(): OutputChannel {
    if (!OutputChannelFactory.outLogChannel) {
      OutputChannelFactory.outLogChannel = window.createOutputChannel(
        'vscode-openai',
        'vscode-openai-log'
      )
    }
    return OutputChannelFactory.outLogChannel
  }

  public static get AppInsights(): TelemetryReporter {
    return OutputChannelFactory.telemetryReporter
  }
  public static set AppInsights(value: TelemetryReporter) {
    OutputChannelFactory.telemetryReporter = value
  }
}
export function registerTelemetryReporter(context: ExtensionContext) {
  OutputChannelFactory.AppInsights = new TelemetryReporter(
    VSCODE_OPENAI_EXTENSION.INSTRUMENTATION_KEY
  )
  context.subscriptions.push(OutputChannelFactory.AppInsights)
}

export function logDebug(message: string): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string

  if (logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [debug]\t${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
    OutputChannelFactory.AppInsights.sendTelemetryEvent('logDebug', {
      message: message,
    })
  }
}

export function logInfo(message: string): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string

  if (logLevel === 'Info' || logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [info]\t${message}`
    OutputChannelFactory.getLogChannel().appendLine(logMessage)
    OutputChannelFactory.AppInsights.sendTelemetryEvent('logInfo', {
      message: message,
    })
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

  OutputChannelFactory.AppInsights.sendTelemetryEvent('logWarning', {
    message: warning?.message,
    stack: warning?.stack,
  })
}

export function logError(error: Error): void {
  const logMessage = `${getTimeAndms()} [error]\t${error.toString()}`.replace(
    /(\r\n|\n|\r)/gm,
    ''
  )
  OutputChannelFactory.getLogChannel().appendLine(logMessage)
  OutputChannelFactory.getLogChannel().show()

  OutputChannelFactory.AppInsights.sendTelemetryErrorEvent('logError', {
    message: error?.message,
    stack: error.stack!,
  })
  OutputChannelFactory.AppInsights.sendTelemetryEvent('logError', {
    message: error?.message,
    stack: error.stack!,
  })
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
