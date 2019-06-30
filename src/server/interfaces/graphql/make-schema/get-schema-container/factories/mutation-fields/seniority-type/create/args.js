import {
  SeniorityType as getSeniorityTypeInput,
  Award as getAwardInput,
} from '../inputs';

const createSeniorityTypeArgs = (ctx) => {
  const {
    utils: { getOperationArgs, getSchemaItem },
  } = ctx;
  const SeniorityTypeInput = getSchemaItem(getSeniorityTypeInput);
  const AwardInput = getSchemaItem(getAwardInput);

  return getOperationArgs('CreateSeniorityTypeInput', (t) => {
    t.field('seniorityType', { type: SeniorityTypeInput, required: true });
    t.field('award', { type: AwardInput, required: false });
  });
};
export default createSeniorityTypeArgs;
