const getSchemaItem = (ctx) => {
  const schemaItems = new Map();

  return (schemaItemFactory) => {
    if (schemaItems.has(schemaItemFactory))
      return schemaItems.get(schemaItemFactory);

    const schemaItem = schemaItemFactory(ctx);
    schemaItems.set(schemaItemFactory, schemaItem);

    return schemaItem;
  };
};
export default getSchemaItem;
