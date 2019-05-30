import getSeniorityType from './get-seniority-type';

const getSeniorityTypeByMonthsMock = (months) =>
  getSeniorityType(null, { months });
export default getSeniorityTypeByMonthsMock;
