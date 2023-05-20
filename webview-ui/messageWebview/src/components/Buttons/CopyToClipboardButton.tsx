import { FC } from 'react'
import { Button, Tooltip } from '@fluentui/react-components'
import {
  bundleIcon,
  Clipboard24Filled,
  Clipboard24Regular,
} from '@fluentui/react-icons'
import { ICodeDocument } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const handleCopyToClipboard = (language: string, content: string) => {
  const codeDocument: ICodeDocument = {
    language: language,
    content: content,
  }
  vscode.postMessage({
    command: 'onDidCreateClipboard',
    text: JSON.stringify(codeDocument),
  })
}

const ClipboardIcon = bundleIcon(Clipboard24Filled, Clipboard24Regular)

const CopyToClipboardButton: FC<ICodeDocument> = ({ language, content }) => {
  return (
    <Tooltip content="Copy to clipboard" relationship="label">
      <Button
        size="small"
        appearance="transparent"
        icon={<ClipboardIcon />}
        onClick={() => handleCopyToClipboard(language, content)}
      >
        Copy
      </Button>
    </Tooltip>
  )
}

export default CopyToClipboardButton
