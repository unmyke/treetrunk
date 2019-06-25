import { arg, inputObjectType } from 'nexus';

const getInputType = (typeName, definition) =>
  inputObjectType({
    name: typeName,
    definition,
  });

const getOperationArgs = () => (inputName, definition) => {
  const inputType = getInputType(inputName, definition);

  return {
    input: arg({ type: inputType, nullable: false }),
  };
};
export default getOperationArgs;
