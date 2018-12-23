export default (theme) => ({
  default: {
    ...theme.typography.button,
  },
  active: {
    color: theme.palette.primary.main,
  },
  button: {
    margin: 0,
  },
});
