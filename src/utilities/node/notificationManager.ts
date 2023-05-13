import {
  TelemetryService,
  logDebug,
  logError,
  logInfo,
  logWarning,
} from '../vscode'

function ensureError(value: unknown): Error {
  if (value instanceof Error) return value

  let stringified = '[Unable to stringify the thrown value]'
  try {
    stringified = JSON.stringify(value)
  } catch {
    /* empty */
  }
  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`
  )
  return error
}

export function createErrorNotification(value: unknown) {
  const error = ensureError(value)
  logError(error)
  TelemetryService.instance.sendTelemetryErrorEvent(error)
}

export function createWarningNotification(value: string) {
  logWarning(value)
}

export function createInfoNotification(value: string) {
  logInfo(value)
  TelemetryService.instance.sendTelemetryEvent(value)
}

export function createDebugNotification(value: string) {
  logDebug(value)
}
