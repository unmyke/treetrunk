import { arg, inputObjectType } from 'nexus';

const getInputType = (typeName, definition) =>
  inputObjectType({
    name: typeName,
    definition,
  });

const getOperationArgs = (inputName, definition) =>
  arg('input', { type: getInputType(inputName, definition), nullable: false });
export default getOperationArgs;
