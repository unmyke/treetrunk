const haveErrors = ({ errors }) => ({
  message: `result has errors`,
  pass: errors && errors.length > 0,
});

export default haveErrors;
