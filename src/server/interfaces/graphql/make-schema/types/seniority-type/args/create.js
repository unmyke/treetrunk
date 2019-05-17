import { arg } from 'nexus';
import {
  SeniorityType as SeniorityTypeInput,
  Award as AwardInput,
} from './inputs';

const createArgs = {
  seniorityType: arg({ type: SeniorityTypeInput, required: true }),
  award: arg({ type: AwardInput, required: true }),
};
export default createArgs;
