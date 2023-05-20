import { FC } from 'react'
import { Button, Tooltip } from '@fluentui/react-components'
import { bundleIcon, Open24Filled, Open24Regular } from '@fluentui/react-icons'
import { ICodeDocument } from '../../interfaces'
import { vscode } from '../../utilities/vscode'

const handleCreateCodeDocument = (language: string, content: string) => {
  const codeDocument: ICodeDocument = {
    language: language,
    content: content,
  }
  vscode.postMessage({
    command: 'onDidCreateDocument',
    text: JSON.stringify(codeDocument),
  })
}

const OpenIcon = bundleIcon(Open24Filled, Open24Regular)

const OpenSourceFileButton: FC<ICodeDocument> = ({ language, content }) => {
  return (
    <Tooltip content="Open code in new source code file" relationship="label">
      <Button
        size="small"
        appearance="transparent"
        icon={<OpenIcon />}
        onClick={() => handleCreateCodeDocument(language, content)}
      >
        Open
      </Button>
    </Tooltip>
  )
}

export default OpenSourceFileButton
