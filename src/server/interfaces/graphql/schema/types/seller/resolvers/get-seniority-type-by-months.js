import SeniorityType from '../../seniority-type';
import { serializedResolver } from '../../generators';

const getSeniorityTypeByMonths = (
  { seniority },
  _,
  { services: { getSeniorityTypeByMonths } }
) =>
  serializedResolver.entity(SeniorityType)(getSeniorityTypeByMonths(seniority));

export default getSeniorityTypeByMonths;
