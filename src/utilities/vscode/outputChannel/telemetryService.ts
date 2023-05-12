import { ExtensionContext } from 'vscode'
import TelemetryReporter from '@vscode/extension-telemetry'
import { VSCODE_OPENAI_EXTENSION } from '@app/contexts'

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

  async sendTelemetryEvent(message: string): Promise<void> {
    this.telemetryReporter.sendTelemetryEvent('Error', {
      message: message,
    })
  }

  async sendTelemetryErrorEvent(error: Error): Promise<void> {
    this.telemetryReporter.sendTelemetryErrorEvent('Error', {
      message: error?.message,
      stack: error.stack!,
    })
  }
}
