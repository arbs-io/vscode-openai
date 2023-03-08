// Copyright (c) Microsoft. All rights reserved.

import { tokens } from '@fluentui/react-components'
import { CSSProperties, FC } from 'react'
import { IChatMessage } from './ChatThread'

interface IData {
  message: IChatMessage
}
export const ChatHistoryItem: FC<IData> = ({ message }) => {
  if (!message) {
    throw new Error('Invalid memory')
  }

  const style: CSSProperties = {
    alignSelf: message.mine ? 'flex-end' : 'flex-start',
    backgroundColor: message.mine
      ? tokens.colorPaletteGreenBackground1
      : tokens.colorNeutralBackground4,
    color: message.mine
      ? tokens.colorPaletteGreenForeground3
      : tokens.colorNeutralForeground4,
    borderRadius: 10,
    padding: '0.5rem',
    maxWidth: '75%',
  }

  const content = message.content.trim().replace(/\n/g, '<br />')

  return (
    <div style={style}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ paddingBottom: 10 }}>
          {message.mine ? null : (
            <span style={{ paddingRight: 20, fontWeight: 'bold' }}>
              {message.author}
            </span>
          )}
          <span style={{ fontSize: 10 }}> Date: {message.timestamp}</span>
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
