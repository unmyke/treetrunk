const GetSeniorityTypeByMonths = ({
  repositories: { SeniorityType: seniorityTypeRepo },
}) => (months) => seniorityTypeRepo.getByMonths(months);

export default GetSeniorityTypeByMonths;
