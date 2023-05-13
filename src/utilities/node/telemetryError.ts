import { TelemetryService, logError } from '../vscode'

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

export function sendTelemetryError(value: unknown) {
  const error = ensureError(value)
  logError(error)
  TelemetryService.instance.sendTelemetryErrorEvent(error)
}
