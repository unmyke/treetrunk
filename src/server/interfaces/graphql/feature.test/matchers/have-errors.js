const haveErrors = (res) =>
  res.then(({ errors }) => {
    const haveErrors = Boolean(errors && errors.length > 0);

    return {
      message: () => `reponse has ${haveErrors ? '' : 'no '}errors`,
      pass: haveErrors,
    };
  });

export default haveErrors;
