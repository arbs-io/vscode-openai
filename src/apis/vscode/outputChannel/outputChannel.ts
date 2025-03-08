import { OutputChannel, window, workspace } from 'vscode';

class OutputChannelFactory {
  private static outLogChannel: OutputChannel;

  public static getLogChannel(): OutputChannel {
    if (!OutputChannelFactory.outLogChannel) {
      OutputChannelFactory.outLogChannel = window.createOutputChannel(
        'vscode-openai',
        'vscode-openai-log'
      );
    }
    return OutputChannelFactory.outLogChannel;
  }
}

export function logDebug(
  value: string | { [key: string]: string },
  eventName: string
): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string;

  const isString = typeof value === 'string' && value !== null;
  if (logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [debug]\t\t${eventName} - ${
      isString ? value : `Logging Object\n${JSON.stringify(value, null, 2)}`
    }`;
    OutputChannelFactory.getLogChannel().appendLine(logMessage);
  }
}

export function logInfo(
  value: string | { [key: string]: string },
  eventName: string
): void {
  const logLevel = workspace
    .getConfiguration('vscode-openai')
    .get('logLevel') as string;

  const isString = typeof value === 'string' && value !== null;
  if (logLevel === 'Info' || logLevel === 'Debug') {
    const logMessage = `${getTimeAndms()} [info]\t\t${eventName} - ${
      isString ? value : `event properties\n${JSON.stringify(value, null, 2)}`
    }`;
    OutputChannelFactory.getLogChannel().appendLine(logMessage);
  }
}

export function logWarning(warning: any): void {
  const logMessage =
    `${getTimeAndms()} [warning]\t${warning.toString()}`.replace(
      /(\r\n|\n|\r)/gm,
      ''
    );
  OutputChannelFactory.getLogChannel().appendLine(logMessage);
  OutputChannelFactory.getLogChannel().show();
}

export function logError(error: Error): void {
  const logMessage = `${getTimeAndms()} [error]\t\t${error.toString()}`.replace(
    /(\r\n|\n|\r)/gm,
    ''
  );
  OutputChannelFactory.getLogChannel().appendLine(logMessage);
  OutputChannelFactory.getLogChannel().show();
}

function getTimeAndms(): string {
  const dt = new Date();
  const output = dt.toISOString().replace('T', ' ').replace('Z', '');
  return `${output}`;
}

export function showInfo(message: string): void {
  OutputChannelFactory.getLogChannel().clear();
  OutputChannelFactory.getLogChannel().appendLine(message);
  OutputChannelFactory.getLogChannel().show();
}
