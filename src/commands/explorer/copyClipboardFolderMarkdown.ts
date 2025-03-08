import { window, Uri, FileType, workspace, ProgressLocation, env } from 'vscode';
import { showMessageWithTimeout } from '@app/apis/vscode';
import { ICommand } from '@app/commands';

export default class ClipboardCopyFolderMarkdownCommand implements ICommand {
  public readonly id = '_vscode-openai.explorer.copy.markdown';
  private readonly maxContentSize = 1024 * 1024; // 1 MB

  public async execute(resourceUri: Uri) {
    // Validate the selected resource
    if (!(resourceUri && resourceUri.scheme === 'file')) {
      showMessageWithTimeout(`Please select a valid file or folder.`, 2500);
      return;
    }

    const stat = await workspace.fs.stat(resourceUri);

    // Show a progress indicator while processing
    await window.withProgress(
      {
        location: ProgressLocation.Notification,
        title: 'Collecting source code...',
        cancellable: false,
      },
      async () => {
        // Initialize variables to collect content and track size
        const collectedContent: string[] = [];
        const totalSize = { size: 0 };

        try {
          if (stat.type & FileType.File) {
            // Process the single file
            await this.processFile(resourceUri, collectedContent, totalSize);
          } else if (stat.type & FileType.Directory) {
            // Start collecting source files
            await this.collectSourceFilesContent(
              resourceUri,
              collectedContent,
              totalSize
            );
          } else {
            showMessageWithTimeout(
              `Selected resource is neither a file nor a folder.`,
              2500
            );

            return;
          }

          const finalContent = collectedContent.join('\n');

          if (finalContent.length === 0) {
            showMessageWithTimeout(
              `No source code files found in the selected location.`,
              2500
            );
            return;
          }

          // Copy the collected content to the clipboard
          await env.clipboard.writeText(finalContent);
          showMessageWithTimeout(`Source code copied to clipboard.`, 2500);
        } catch (error) {
          if (
            error instanceof Error &&
            error.message === 'Content size limit exceeded'
          ) {
            showMessageWithTimeout(
              `Content size exceeds the maximum limit.`,
              2500
            );
          } else {
            console.error('Error while collecting source files:', error);
            showMessageWithTimeout(
              `An error occurred while collecting source files.`,
              2500
            );
          }
        }
      }
    );
  }

  private async processFile(
    fileUri: Uri,
    collectedContent: string[],
    totalSize: { size: number }
  ) {
    try {
      // Read the file content
      const document = await workspace.openTextDocument(fileUri);
      const content = document.getText();
      const languageId = document.languageId;

      // Build the code block with a comment and code fence
      const relativePath = workspace.asRelativePath(fileUri);
      const codeBlock = [
        `// File: ${relativePath}`,
        `\`\`\`${languageId}`,
        content,
        `\`\`\``,
        '',
      ].join('\n');

      // Update the total size and check the limit
      totalSize.size += codeBlock.length;
      if (totalSize.size > this.maxContentSize) {
        throw new Error('Content size limit exceeded');
      }

      // Add the code block to the collected content
      collectedContent.push(codeBlock);
    } catch (error) {
      console.warn(`Failed to process file ${fileUri.fsPath}:`, error);
      // You may choose to continue or handle the error as needed
    }
  }

  /**
   * Recursively collects content from source code files in the given folder.
   * @param folderUri The URI of the folder to process.
   * @param collectedContent The array to collect content strings.
   * @param totalSize An object to track the total size of collected content.
   */
  private async collectSourceFilesContent(
    folderUri: Uri,
    collectedContent: string[],
    totalSize: { size: number }
  ) {
    const entries = await workspace.fs.readDirectory(folderUri);

    for (const [name, fileType] of entries) {
      const resourceUri = Uri.joinPath(folderUri, name);

      if (fileType & FileType.File) {
        await this.processFile(resourceUri, collectedContent, totalSize);
      } else if (fileType & FileType.Directory) {
        // Recursively process subfolders
        await this.collectSourceFilesContent(
          resourceUri,
          collectedContent,
          totalSize
        );
      }
    }
  }
}
