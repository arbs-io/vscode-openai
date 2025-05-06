import { makeStyles } from '@fluentui/react-components';

export const useStyles = makeStyles({
  activateButtons: {
    color: 'var(--vscode-button-foreground)',
    display: 'none',
    ':hover': {
      color: 'var(--vscode-button-hoverForeground)',
      display: 'block',
    },
    ':hover:active': {
      color: 'var(--vscode-button-activeForeground)',
    },
  },
  conversationRow: {
    backgroundColor: 'var(--vscode-editor-background)',
    color: 'var(--vscode-editor-foreground)',
    padding: '0.5rem',
    borderBottom: '1px solid var(--vscode-editorGroup-border)',
    ':hover': {
      backgroundColor: 'var(--vscode-list-hoverBackground)',
    },
  },
});
