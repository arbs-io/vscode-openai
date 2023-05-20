import { makeStyles, tokens } from '@fluentui/react-components'

export const useStyles = makeStyles({
  activateButtons: {
    color: tokens.colorBrandBackgroundInverted,
    display: 'none',
    ':hover': {
      color: tokens.colorBrandBackgroundInverted,
      display: 'block',
    },
    ':hover:active': {
      color: tokens.colorNeutralForegroundOnBrand,
    },
  },
})
