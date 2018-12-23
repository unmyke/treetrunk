export default (theme) => ({
  '@global': {
    body: {
      backgroundColor: theme.palette.common.white,
    },
  },
  layout: {
    'min-width': theme.breakpoints.values.lg,
  },
});
