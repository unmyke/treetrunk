const CreateSeniorityTypeAward = ({
  repositories: { SeniorityType: seniorityTypeRepo },
  commonTypes: { SeniorityTypeId, Day },
}) => (seniorityTypeIdValue, { value, day: date }) =>
  seniorityTypeRepo
    .getById(new SeniorityTypeId({ value: seniorityTypeIdValue }))
    .then((seniorityType) => {
      seniorityType.addAward(value, new Day({ value: date }));

      return seniorityTypeRepo.save(seniorityType);
    });

export default CreateSeniorityTypeAward;
