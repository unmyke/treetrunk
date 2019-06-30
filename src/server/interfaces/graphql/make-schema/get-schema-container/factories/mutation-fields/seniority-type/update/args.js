import { SeniorityType as getSeniorityTypeInput } from '../inputs';

const updateSeniorityTypeArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const SeniorityTypeInput = getSchemaItem(getSeniorityTypeInput);

  return getOperationArgs('UpdateSeniorityTypeInput', (t) => {
    t.id('id', { required: true });
    t.field('seniorityType', { type: SeniorityTypeInput, required: true });
  });
};
export default updateSeniorityTypeArgs;
