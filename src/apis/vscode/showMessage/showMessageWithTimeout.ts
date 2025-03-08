import { ProgressLocation, window } from 'vscode';
import { waitFor } from '@app/apis/node';

export const showMessageWithTimeout = (
  message: string,
  timeout = 3000
): void => {
  window.withProgress(
    {
      location: ProgressLocation.Notification,
      title: message,
      cancellable: false,
    },

    async (progress): Promise<void> => {
      await waitFor(timeout, () => {
        return false;
      });
      progress.report({ increment: 100 });
    }
  );
};
