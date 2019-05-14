export default (serializer) => ({ entities, hasBefore, hasAfter }) => ({
  entities: entities.map((entity) => serializer(entity)),
  hasBefore,
  hasAfter,
});
