import {
  Toolbar,
  ToolbarButton,
  ToolbarProps,
} from '@fluentui/react-components'
import * as React from 'react'
import {
  ChatHelp24Regular,
  FontDecrease24Regular,
  TextFont24Regular,
} from '@fluentui/react-icons'

export const Default = (props: Partial<ToolbarProps>) => (
  <Toolbar
    {...props}
    aria-label="Small"
    size="small"
    style={{
      padding: '1rem',
    }}
  >
    <ToolbarButton aria-label="Reset Font Size" icon={<ChatHelp24Regular />} />
    <ToolbarButton
      aria-label="Decrease Font Size"
      icon={<FontDecrease24Regular />}
    />
    <ToolbarButton aria-label="Reset Font Size" icon={<TextFont24Regular />} />
  </Toolbar>
)
