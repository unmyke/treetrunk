const Create = (EntityName) => ({
  repositories: { [EntityName]: entityRepo },
  entities: { [EntityName]: Entity },
}) => (fields) => entityRepo.add(new Entity(fields));

export default Create;