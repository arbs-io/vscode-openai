import { FC } from 'react'
import { Button, Tooltip } from '@fluentui/react-components'
import {
  bundleIcon,
  Clipboard24Filled,
  Clipboard24Regular,
} from '@fluentui/react-icons'
import { ICodeDocument } from '@app/interfaces'
import { vscode } from '@app/utilities'

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

// Creating a bundled icon for the clipboard
const ClipboardIcon = bundleIcon(Clipboard24Filled, Clipboard24Regular)

// Defining the component with explicit props type
export const ButtonCopyToClipboard: FC<ICodeDocument> = ({
  language,
  content,
}) => {
  return (
    <Tooltip content="Copy to clipboard" relationship={'label'}>
      <Button
        size="small"
        appearance="transparent"
        icon={<ClipboardIcon />}
        onClick={() => handleCopyToClipboard(language, content)}
        aria-label="Copy code to clipboard" // Enhancing accessibility
      >
        Copy
      </Button>
    </Tooltip>
  )
}
