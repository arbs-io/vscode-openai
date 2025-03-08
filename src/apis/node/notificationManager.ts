import {
  TelemetryService,
  logDebug,
  logError,
  logInfo,
  logWarning,
} from '@app/apis/vscode';

function ensureError(value: unknown): Error {
  if (value instanceof Error) {return value;}

  let stringified = '[Unable to stringify the thrown value]';
  try {
    stringified = JSON.stringify(value);
  } catch {
    /* empty */
  }
  const error = new Error(
    `This value was thrown as is, not through an Error: ${stringified}`
  );
  return error;
}

export function createErrorNotification(value: unknown) {
  const error = ensureError(value);
  logError(error);
  TelemetryService.instance.sendTelemetryErrorEvent(error);
}

export function createWarningNotification(value: string) {
  logWarning(value);
}

export function createInfoNotification(
  value: string | { [key: string]: string },
  eventName = 'event'
) {
  logInfo(value, eventName);
  TelemetryService.instance.sendTelemetryEvent(value, eventName);
}

export function createDebugNotification(
  value: string | { [key: string]: string },
  eventName = 'event'
) {
  logDebug(value, eventName);
}
