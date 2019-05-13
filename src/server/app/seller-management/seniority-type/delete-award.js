const DeleteSeniorityTypeAward = ({
  repositories: { SeniorityType: seniorityTypeRepo },
  commonTypes: { SeniorityTypeId, Day },
}) => (seniorityTypeIdValue, date) =>
  seniorityTypeRepo
    .getById(new SeniorityTypeId({ value: seniorityTypeIdValue }))
    .then((seniorityType) => {
      seniorityType.deleteAwardAt(new Day({ value: date }));

      return seniorityTypeRepo.save(seniorityType);
    });

export default DeleteSeniorityTypeAward;
