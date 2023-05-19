import { makeStyles, tokens } from '@fluentui/react-components'

export const useStyles = makeStyles({
  horizontalPadding: {
    paddingLeft: '0.5rem',
    paddingRight: '0.5rem',
  },
  dangerButton: {
    backgroundColor: tokens.colorPaletteRedBackground3,
    color: tokens.colorNeutralForegroundOnBrand,
  },
})
