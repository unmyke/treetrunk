const UpdateSeniorityTypeAward = ({
  repositories: { SeniorityType: seniorityTypeRepo },
  commonTypes: { SeniorityTypeId, Day },
}) => (seniorityTypeIdValue, date, { value, day: newDate }) =>
  seniorityTypeRepo
    .getById(new SeniorityTypeId({ value: seniorityTypeIdValue }))
    .then((seniorityType) => {
      seniorityType.updateAwardTo(
        new Day({ value: date }),
        value,
        new Day({ value: newDate })
      );

      return seniorityTypeRepo.save(seniorityType);
    });

export default UpdateSeniorityTypeAward;
