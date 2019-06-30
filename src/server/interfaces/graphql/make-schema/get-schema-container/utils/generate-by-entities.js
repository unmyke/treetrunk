const generateByEntities = (generatedEntities) => (ctx) =>
  Object.entries(generatedEntities).reduce(
    (prevGeneratedEntities, [generatedEntityName, generatedEntity]) => ({
      ...prevGeneratedEntities,
      [generatedEntityName]: generatedEntity(ctx),
    }),
    {}
  );
export default generateByEntities;
