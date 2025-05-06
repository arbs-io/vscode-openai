import { ICodeDocument } from '@app/interfaces';
import { vscode } from '@app/utilities';
import { Button, Tooltip } from '@fluentui/react-components';
import { Open16Regular } from '@fluentui/react-icons';
import { FC, ReactElement } from 'react';

// Function to handle the creation of a code document
const handleCreateCodeDocument = (language: string, content: string) => {
  const codeDocument: ICodeDocument = {
    language,
    content,
  }
  // Sending a message to VSCode or similar environment to handle document creation
  vscode.postMessage({
    command: 'onDidCreateDocument',
    text: JSON.stringify(codeDocument),
  })
}

// Bundling icons for different states
// const OpenIcon = bundleIcon(Open24Filled, Open24Regular)

// Functional component for opening a source file
export const ButtonOpenSourceFile: FC<ICodeDocument> = ({
  language,
  content,
}): ReactElement => {
  return (
    <Tooltip content="Open code in new source code file" relationship="label">
      <Button
        appearance="transparent"
        size="small"
        icon={<Open16Regular />}
        onClick={() => handleCreateCodeDocument(language, content)}
      >
      </Button>
    </Tooltip>
  )
}
