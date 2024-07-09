import { FC, ReactElement } from 'react'
import { Button, Tooltip } from '@fluentui/react-components'
import { bundleIcon, Open24Filled, Open24Regular } from '@fluentui/react-icons'
import { ICodeDocument } from '@app/interfaces'
import { vscode } from '@app/utilities'

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
const OpenIcon = bundleIcon(Open24Filled, Open24Regular)

// Defining props specifically for this component for clarity and future-proofing
interface ButtonOpenSourceFileProps extends ICodeDocument {}

// Functional component for opening a source file
export const ButtonOpenSourceFile: FC<ButtonOpenSourceFileProps> = ({
  language,
  content,
}): ReactElement => {
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
