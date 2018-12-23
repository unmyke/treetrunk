import { lighten } from '@material-ui/core/styles/colorManipulator';

export default (theme) => ({
  root: {
    paddingRight: theme.spacing.unit,
    color: theme.palette.secondary.main,
  },
  highlight: {
    single: {
      backgroundColor: lighten(theme.palette.secondary.light, 0.9),
    },
    set: {
      backgroundColor: lighten(theme.palette.secondary.light, 0.85),
    },
  },
  spacer: {
    flex: '1 1 100%',
  },
});
