const getErrorMessager = (haveErrors) => (errors) => {
  const errorOutputMapper = (error) => {
    const {
      path,
      originalError: { stack },
      source: { name: sourceName },
    } = error;

    return `
      ${sourceName}: ${path.join('->')}
      ${stack}
    `;
  };

  const title = `response has ${haveErrors ? '' : 'no '}errors.`;

  return () =>
    `${title}${haveErrors &&
      `
    ${errors.map((error) => errorOutputMapper(error))}`}`;
};

const haveErrors = (res) =>
  res.then((res) => {
    const { errors } = res || {};
    const haveErrors = Boolean(errors && errors.length > 0);
    const getMessager = getErrorMessager(haveErrors);

    return {
      message: getMessager(errors),
      pass: haveErrors,
    };
  });

export default haveErrors;
