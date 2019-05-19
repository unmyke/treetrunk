const Create = ({
  entities: { SeniorityType },
  repositories: { SeniorityType: seniorityTypeRepo },
  commonTypes: { Day },
}) => ({ seniorityType: { name, months }, award }) => {
  const newSeniorityType = new SeniorityType({ name, months });

  if (award) {
    const { value, day: awardDate } = award;
    newSeniorityType.addAward(value, new Day({ value: awardDate }));
  }

  return seniorityTypeRepo.save(newSeniorityType);
};

export default Create;
