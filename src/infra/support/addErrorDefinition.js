export const addErrorDefinitionProperty = (
  Class,
  propertyName,
  message,
  ...details
) => {
  const error = new Error(message);
  error.details = details;

  Object.defineProperty(Class, propertyName, {
    value: error,
  });
};
