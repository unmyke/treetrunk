const haveErrors = ({ errors }) => ({
  message: `result has errors`,
  pass: Boolean(errors && errors.length > 0),
});

export default haveErrors;
