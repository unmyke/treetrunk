const getCreateTypeMutationField = (ctx) => {
  const {
    utils: { getMutationField },
  } = ctx;

  return (type, { args, resolver }) => {
    const createTypeMutationField = getMutationField(
      {
        name: 'create',
        type,
        description: `Create ${type.name}`,
        args,
        resovle: resolver,
      },
      type
    );
    return createTypeMutationField;
  };
};
export default getCreateTypeMutationField;
