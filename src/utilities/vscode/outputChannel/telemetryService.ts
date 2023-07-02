import { ExtensionContext } from 'vscode'
import TelemetryReporter from '@vscode/extension-telemetry'
import { VSCODE_OPENAI_EXTENSION } from '@app/constants'

export default class TelemetryService {
  private static _instance: TelemetryService

  constructor(private telemetryReporter: TelemetryReporter) {}

  static init(context: ExtensionContext): void {
    const telemetryReporter = new TelemetryReporter(
      VSCODE_OPENAI_EXTENSION.INSTRUMENTATION_KEY
    )
    TelemetryService._instance = new TelemetryService(telemetryReporter)
    context.subscriptions.push(TelemetryService._instance.telemetryReporter)
  }

  static get instance(): TelemetryService {
    return TelemetryService._instance
  }

  async sendTelemetryEvent(
    value: string | { [key: string]: string },
    eventName: string
  ): Promise<void> {
    const isString = typeof value === 'string' && value !== null
    if (isString) {
      this.telemetryReporter.sendTelemetryEvent(eventName, {
        message: value,
      })
    } else {
      this.telemetryReporter.sendTelemetryEvent(eventName, value)
    }
  }

  async sendTelemetryErrorEvent(error: Error): Promise<void> {
    this.telemetryReporter.sendTelemetryErrorEvent('Error', {
      message: error?.message,
      stack: error.stack!,
    })
  }
}
