import { ICodeDocument } from '@app/interfaces';
import { vscode } from '@app/utilities';
import { Button, Tooltip } from '@fluentui/react-components';
import {
  Clipboard16Regular
} from '@fluentui/react-icons';
import { FC } from 'react';

const handleCopyToClipboard = (language: string, content: string) => {
  const codeDocument: ICodeDocument = {
    language,
    content,
  }
  vscode.postMessage({
    command: 'onDidCopyClipboardCode',
    text: JSON.stringify(codeDocument),
  })
}

// Defining the component with explicit props type
export const ButtonCopyToClipboard: FC<ICodeDocument> = ({
  language,
  content,
}) => {
  return (
    <Tooltip content="Copy to clipboard" relationship={'label'}>
      <Button
        appearance="transparent"
        size="small"
        icon={<Clipboard16Regular />}
        onClick={() => handleCopyToClipboard(language, content)}
      >
      </Button>
    </Tooltip>
  )
}
