import withEquals from './with-quals';

const ValueObject = (ValueFactory) => (...args) => {
  const type = ValueFactory.name;

  return Object.freeze({
    type,
    ...ValueFactory(...args),
  });
};
// export default ValueObject;
export default withEquals(ValueObject);
